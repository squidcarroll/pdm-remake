<template>
  <div id="login">
    <md-button class="md-raised" @click="getPorts">refresh</md-button>
    <md-button
      class="md-raised md-primary"
      v-if="ports != 'no ports' && selectedPort && !loggedIn"
      @click="login"
    >Connect</md-button>
    <md-button v-else class="md-raised md-primary" :disabled="true">Connect</md-button>
    <md-field>
      <md-select v-if="ports != 'no ports'" name="ports" v-model="selectedPort">
        <md-option
          v-for="selectedPort in ports"
          v-bind:key="selectedPort"
          v-bind:value="selectedPort"
        >{{ selectedPort }}</md-option>
      </md-select>
      <md-select v-else>
        <span>No Ports Available</span>
      </md-select>
    </md-field>
    <p v-if="loggedIn">Successfully logged in</p>
    <p v-if="!loggedIn && !selectedPort">Select port to connect to</p>
    <p v-if="!loggedIn && selectedPort">Selected port {{selectedPort}}</p>
  </div>
</template>

<script>
import serialport from "serialport";
import Login from "./modules/login";

export default {
  name: "login",
  data() {
    return {
      ports: [],
      selectedPort: "",
      port: null,
      lastSent: "",
      pass: Buffer.from([]),
      loggedIn: false
    };
  },
  created() {
    this.getPorts();
    this.$logger.log("info", "getting ports");
    // const pasBuf = Buffer.alloc(7, "sapatsn", "ascii");
    // const checkSum = Buffer.alloc(1, 0x06);
    this.pass = Buffer.concat(
      [Buffer.alloc(7, "sapatsn", "ascii"), Buffer.alloc(1, 0x06)],
      8
    );
  },
  methods: {
    getPorts: function() {
      console.log(this.port, this.loggedIn);
      serialport.list().then(ps => {
        let pList = [];
        for (let i = 0; i < ps.length; i++) {
          pList.push(ps[i].path);
        }
        if (pList.length > 0) {
          this.ports = pList;
        } else {
          this.ports = "no ports";
        }
        // return pList;
        // return ps.toString();
      });
    },
    createOpenPort: async function() {
      return new Promise((res, rej) => {
        console.log("enterd promise");
        if (!this.port) {
          console.log("enterd if");
          this.port = new serialport(this.selectedPort, {
            baudRate: 9600,
            autoOpen: false
          });
          this.$logger.log("info", `Connecting to port ${this.selectedPort}`);
        }
        this.port.open(function(err) {
          if (err) {
            console.log(this.selectedPort);
            console.log(this.port);
          } else {
            res();
          }
        });
      });
    },
    login: async function() {
      try {
        this.$logger.log("info", "Opening port");
        await this.createOpenPort();
        // await this.port.flush();
        await this.loginAsync();

        if (this.loggedIn) {
          this.startLoop();
        } else {
          console.log("Failed to log in");
        }
      } catch (e) {
        if (e == "Did not match" && !this.loggedIn) {
          this.$logger.log("info", "Attemping login again");
          // this.login();
        }
        this.$logger.log("info", `${e}`);
        console.log("lo");
      }
    },
    loginAsync: async function() {
      return new Promise(async (res, rej) => {
        try {
          this.lastSent = "I";
          if (await this.getAckAsync("I")) {
            console.log("Acknowledged, sending password");
            this.sendBuf(this.pass);
            let retVal = await this.captureExpected(9);
            if (retVal[8].toString() == "73") {
              this.$logger.log("info", "Login Successful");
              this.loggedIn = true;
              res("login successful");
            } else {
              this.$logger.log("warn", "Did not receive expected login bytes");
              rej(false);
            }
          } else {
            this.$logger.log("error", "Did not receive login response");
            rej(false);
          }
        } catch (e) {
          console.log("LOGGED INNN????", this.loggedIn);
          console.log(e);
          this.$logger.log("error", `${e}`);
          rej(false);
        }
      });
    },
    captureExpected: async function(len) {
      let data = await this.captureDataAsync();
      let tmp;
      console.log(data);
      while (data.length < len) {
        tmp = await this.captureDataAsync();
        data = Buffer.concat([data, Buffer.from(tmp)]);
      }
      if (data.length == len) {
        console.log(data);
        return data;
      }
    },
    handleDisconnect: function() {
      console.log("port closed");
      this.port = null;
      console.log(this.port);
      this.loggedIn = false;
      console.log(this.loggedIn);
    },
    startLoop: async function() {
      let data;
      this.$logger.log("info", "Starting y message loop");
      this.port.on("close", this.handleDisconnect);
      // if (this.port) {
      //   setInterval(() => {
      //     if (this.port) if (this.port.isOpen) this.inputCmd("y");
      //   }, 250);
      // }

      while (this.port && this.loggedIn) {
        console.log(this.port);
        setTimeout(() => {
          this.inputCmd("y");
        }, 250);
        if (this.port.isOpen && this.loggedIn) {
          data = await this.receiveIncomingData();
          if (data.length > 0) {
            this.$root.$emit("handleData", data);
          } else console.log("waiting for data");
          this.port.removeAllListeners("data");
        } else {
          console.log("port has been closed");
        }
      }
    },
    sendBuf: async function(buf) {
      return new Promise((res, rej) => {
        this.port.write(buf, err => {
          if (err) {
            rej(err.message);
          } else {
            res(true);
          }
        });
      });
    },
    captureDataAsync: async function() {
      return new Promise(async (resolve, reject) => {
        function cb(data) {
          if (data) {
            this.removeListener("data", cb);
            resolve(data);
          }
        }
        if (this.port) {
          this.port.on("data", cb);
        } else {
          console.log("Cannot write, port is closed");
        }
      });
    },
    sendCmd: async function(cmd) {
      if (Login.validCmds.hasOwnProperty(cmd) && this.port) {
        this.port.write(Buffer.from(cmd), err => {
          if (err) {
            console.log(err.message);
            console.log("wowowowwowowowowow");
            return false;
          } else {
            console.log("Sent:", cmd);
            return true;
          }
        });
      } else {
        if (!this.port) {
          this.$logger.log("warn", "Port is closed");
        } else {
          this.$logger.log("warn", "Not a valid command");
        }
        return false;
      }
    },
    getAckAsync: async function(cmd) {
      let echo;
      return new Promise(async (res, rej) => {
        this.$logger.log("info", `sending cmd: ${cmd}`);

        //send command once to start acknowledgement
        if (this.sendCmd(cmd)) {
          echo = await this.captureDataAsync();
          let cmdByte = Buffer.from(cmd)[0];

          if (cmdByte == echo[0]) {
            //send same command again to get acknowledgement
            if (this.sendCmd(cmd)) {
              echo = await this.captureDataAsync();
              if (echo[0] == cmdByte) {
                console.log("matched twice");
                res(true);
              } else {
                // this.$logger.log(`Sent command: ${cmd} did not return a match`);
                this.$logger.log(`Received command: ${echo[0]}`);
                rej(false);
              }
            }
          } else {
            rej(false);
          }
        } else rej(false);
      });
    },
    inputCmd: async function(cmd) {
      this.lastSent = cmd;
      return new Promise(async (res, rej) => {
        let data;
        try {
          await this.getAckAsync(cmd);
        } catch (e) {
          console.log(e);
          rej(e);
        }
      });
    },
    receiveIncomingData: async function() {
      return new Promise(async (res, rej) => {
        let data = Buffer.from([]);
        let holder;

        this.$logger.log("info", `last cmd ${this.lastSent}`);

        this.$logger.log(
          "info",
          `Expected ${Login.validCmds[this.lastSent].expBytes + 2} Bytes`
        );
        while (data.length < Login.validCmds[this.lastSent].expBytes + 2) {
          // while (1) {
          holder = await this.captureDataAsync();
          data = Buffer.concat([data, Buffer.from(holder)]);
        }
        if (data.length > 0) {
          res(data);
        } else res([]);
      });
    }
  }
};
</script>

<style>
/* #login {
  width: 210px !important;
} */
</style>