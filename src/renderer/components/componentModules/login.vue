<template>
  <div id="login">
    <h4>Select Port</h4>
    <md-button class="md-raised" @click="getPorts">refresh</md-button>
    <md-button
      class="md-raised md-primary"
      v-if="ports != 'no ports' && selectedPort"
      @click="login"
    >Connect</md-button>
    <md-button v-else class="md-raised md-primary" :disabled="true">Connect</md-button>
    <md-field>
      <md-select v-if="ports != 'no ports'" name="ports" v-model="selectedPort">
        <md-option v-for="port in ports" v-bind:key="port" v-bind:value="port">{{ port }}</md-option>
      </md-select>
      <md-select v-else>
        <span>No Ports Available</span>
      </md-select>
    </md-field>
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
      selectedPort: null,
      port: null,
      lastSent: "",
      pass: Buffer.from([])
    };
  },
  created() {
    this.getPorts();
    // const pasBuf = Buffer.alloc(7, "sapatsn", "ascii");
    // const checkSum = Buffer.alloc(1, 0x06);
    this.pass = Buffer.concat(
      [Buffer.alloc(7, "sapatsn", "ascii"), Buffer.alloc(1, 0x06)],
      8
    );
  },
  methods: {
    getPorts: function() {
      serialport.list().then(ps => {
        let pList = [];
        for (let i = 0; i < ps.length; i++) {
          console.log(ps[i].path);
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
    login: async function() {
      if (!this.port) {
        this.port = new serialport(this.selectedPort, {
          baudRate: 9600,
          autoOpen: false
        });

        try {
          console.log(await this.openPort(this.selectedPort));
          await this.loginAsync();
          this.startLoop();
        } catch (e) {
          console.log(e);
        }
      } else {
        if (this.port.isOpen) console.log("Port is already open");
      }
    },
    openPort: function(p) {
      return new Promise((res, rej) => {
        this.port.open(err => {
          if (err) {
            rej(err.message);
          } else {
            res(`Connection to port ${p.path} established`);
          }
        });
      });
    },
    loginAsync: async function() {
      console.log("Starting Login");
      return new Promise(async (res, rej) => {
        try {
          this.lastSent = "I";
          console.log("ayo");
          if (await this.getAckAsync("I")) {
            console.log("Acknowledged, sending password");
            this.sendBuf(this.pass);
            let retVal = await this.captureExpected(9);
            if (retVal[8].toString() == "73") {
              res(console.log("login successful"));
            } else {
              rej("Characters do not match");
            }
          } else {
            rej("Login failed2");
          }
        } catch (e) {
          console.log(e);
          rej("failed to login3");
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
    startLoop: async function() {
      let data;

      setInterval(() => {
        if (this.port.isOpen) this.inputCmd("y");
        // console.log("yo");
      }, 250);
      // this.port.on("open", async () => {
      while (this.port.isOpen) {
        data = await this.receiveIncomingData();
        if (data.length > 0) {
          this.$root.$emit("handleData", data);
        } else console.log("waiting for data");
        this.port.removeAllListeners("data");
      }
      // });
    },
    sendBuf: async function(buf) {
      return new Promise((res, rej) => {
        this.port.write(buf, err => {
          if (err) {
            rej(err.message);
          } else {
            console.log("Sent buf");
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
          } else {
            console.log("booo");
          }
        }
        this.port.on("data", cb);
      });
    },
    sendCmd: async function(cmd) {
      if (Login.validCmds.hasOwnProperty(cmd)) {
        this.port.write(Buffer.from(cmd), err => {
          if (err) {
            console.log(err.message);
            return false;
          } else {
            console.log("Sent:", cmd);
            return true;
          }
        });
      } else {
        console.log("Not a valid command");
        return false;
      }
    },
    getAckAsync: async function(cmd) {
      let echo;
      return new Promise(async (res, rej) => {
        console.log("sending cmd:", cmd);

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
                rej("did not match twice");
              }
            }
          } else {
            rej("Did not match");
          }
        } else rej("Could not send:", cmd);
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

        console.log("last sent cmd", this.lastSent);
        console.log(
          "Expected Bytes",
          Login.validCmds[this.lastSent].expBytes + 2
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