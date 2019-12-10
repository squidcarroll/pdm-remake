/* eslint-disable */
<template>
  <div class="md-layout md-gutter">
    <div class="md-layout-item">
      <div id="rpm"></div>
      <div>
        <md-button class="md-raised" @click="log">Log Data</md-button>
      </div>
    </div>
    <div class="md-layout-item">
      <md-table class="mytable">
        <md-table-toolbar>
          <h1 class="md-title" md-fixed-header>
            <md-button @click="swap" :disabled="!permView">Data</md-button>
          </h1>
          <h1 class="md-title" md-fixed-header>
            <md-button @click="swap" :disabled="permView">Permissives</md-button>
          </h1>
        </md-table-toolbar>

        <template v-if="!permView" v-for="(value, key) in yData">
          <md-table-row>
            <md-table-cell>{{ key }}</md-table-cell>
            <md-table-cell>{{ value.data }}</md-table-cell>
          </md-table-row>
        </template>
        <template v-if="permView" v-for="(value, key) in getPerms">
          <md-table-row>
            <md-table-cell>{{ key }}</md-table-cell>
            <md-table-cell>{{ value }}</md-table-cell>
          </md-table-row>
        </template>
      </md-table>
    </div>
  </div>
</template>

<script>
import Data from "./modules/Objects.js";
import Login from "./modules/login";
import JustGage from "justgage";
import Log from "./modules/fileSave";
import byte from "bitwise/byte";
const fs = require("fs");

export default {
  name: "showData",
  data() {
    return {
      yData: Data.oper_stat,
      permView: false
    };
  },
  created() {
    console.log(this.yData);
  },
  mounted() {
    this.$root.$on("handleData", data => {
      console.log(data);
      // your code goes here
      this.dataHandler(data);
    });
    var g = new JustGage({
      id: "rpm",
      value: 0,
      min: 0,
      max: 2500,
      title: "RPM",
      valueFontColor: "#dddddd",
      label: "RPM",
      labelMinFontSize: "12px",
      gaugeColor: "#404040"
    });
    setInterval(() => {
      g.refresh(this.yData.rpm_snapshot.data);
    }, 100);
  },
  computed: {
    getPerms: function() {
      let p = Object.assign(
        {},
        this.yData["permissives"].bytes["permis_byte_hi"].data,
        this.yData["permissives"].bytes["permis_byte_lo"].data,
        this.yData["permissives1"].bytes["permis1_byte_hi"].data,
        this.yData["permissives1"].bytes["permis1_byte_lo"].data,
        this.yData["permissives2"].bytes["permis2_byte_hi"].data,
        this.yData["permissives2"].bytes["permis2_byte_lo"].data
      );
      console.log("THESE ARE THE PERMS", p);
      return p;
    }
  },
  methods: {
    swap: function() {
      this.permView = !this.permView;
    },
    log: function() {
      console.log("Saving current data");
      Log.saveSnapshot(this.yData);
    },
    setData: function(recData) {
      console.log("REC", recData);
      console.log("ydata length", this.yData);
      for (let x in this.yData) {
        // console.log(myObj[x].dataLen);
        if (this.yData[x].dataLen == 1) {
          //read and store bytes
          this.yData[x].data = recData.readInt8(this.yData[x].byte);
        } else if (this.yData[x].dataLen == 2) {
          //read and store words
          this.yData[x].data = recData.readInt16BE(this.yData[x].byte);
        } else if (this.yData[x].dataLen == 0) {
          //read and store bits
          let bits = [];
          for (let b in this.yData[x].bytes) {
            // console.log("b is:", b);
            // console.log("byte is", this.yData[x].bytes[b].byte);
            // console.log("bit in data", recData[this.yData[x].bytes[b].byte]);
            // if (recData[this.yData[x].bytes[b].byte] > 0) {
            // console.log("Byte to read:", this.yData[x].bytes[b].byte);
            // console.log(
            //   "INT:",
            //   recData.readInt8(this.yData[x].bytes[b].byte)
            // );
            // console.log(this.yData[x].bytes[b])

            let arr = byte.read(recData[this.yData[x].bytes[b].byte]);

            // console.log("ARR", arr);
            let n = 0;
            for (let c in this.yData[x].bytes[b].data) {
              this.yData[x].bytes[b].data[c] = arr[n];
              n++;
              // }
              // } else {
              // console.log("No data to read... skipping");
            }
          }
        } else {
          console.log("failed to write data to", x);
        }
      }
    },
    dataHandler: function(data) {
      //must change later to direct data to correct locations
      //if cmd y
      let cmd = String.fromCharCode(data[0]);
      if (data[0] == data[1]) {
        if (Login.validCmds.hasOwnProperty(cmd)) {
          let justDataBuf = data.slice(2);
          console.log("just data", justDataBuf);
          console.log("received", cmd);
          this.setData(justDataBuf);
        }
        // console.log(justDataBuf);
        // console.log("setting data");

        // console.log(this.yData);
      }
    }
  }
};
</script>

<style scoped>
.mytable {
  height: 90vh;
  /* width: 30vw; */
}
</style>
