/* eslint-disable */
<template>
  <div class="md-layout md-gutter">
    <div class="md-layout-item ">
      <div id="rpm"></div>
      <div>
        <md-button class="md-raised" @click="log">Log Data</md-button>
      </div>
    </div>
    <div class="md-layout-item">
      <md-table class="mytable">
        <md-table-toolbar>
          <h1 class="md-title" md-fixed-header>Data</h1>
        </md-table-toolbar>

        <template v-for="(value, key) in yData">
          <md-table-row>
            <md-table-cell>{{ key }}</md-table-cell>
            <md-table-cell>{{ value.data }}</md-table-cell>
          </md-table-row>
        </template>
      </md-table>
    </div>
  </div>
</template>

<script>
import Data from './modules/Objects.js'
import Login from './modules/login'
import JustGage from 'justgage'
import Log from './modules/fileSave'
const fs = require('fs')

export default {
  name: 'showData',
  data() {
    return {
      yData: Data.oper_stat
    }
  },
  created() {
    console.log(this.yData)
  },
  mounted() {
    this.$root.$on('handleData', data => {
      console.log(data)
      // your code goes here
      this.dataHandler(data)
    })
    var g = new JustGage({
      id: 'rpm',
      value: 0,
      min: 0,
      max: 2500,
      title: 'RPM',
      valueFontColor: '#dddddd',
      label: 'RPM',
      labelMinFontSize: '12px',
      gaugeColor: '#404040'
    })
    setInterval(() => {
      g.refresh(this.yData.rpm_snapshot.data)
    }, 100)
  },
  methods: {
    log: function() {
      console.log('Saving current data')
      Log.saveSnapshot(this.yData)
    },
    setData: function(recData) {
      // console.log(recData)
      for (let x in this.yData) {
        // console.log(myObj[x].dataLen);
        if (this.yData[x].dataLen == 1) {
          this.yData[x].data = recData.readInt8(this.yData[x].byte)
        } else if (this.yData[x].dataLen == 2) {
          this.yData[x].data = recData.readInt16BE(this.yData[x].byte)
        } else {
          console.log('failed to write data to', x)
        }
      }
    },
    dataHandler: function(data) {
      //must change later to direct data to correct locations
      //if cmd y
      let cmd = String.fromCharCode(data[0])
      if (data[0] == data[1]) {
        if (Login.validCmds.hasOwnProperty(cmd)) {
          let justDataBuf = data.slice(2)
          console.log('received', cmd)
          this.setData(justDataBuf)
        }
        // console.log(justDataBuf);
        // console.log("setting data");

        console.log(this.yData)
      }
    }
  }
}
</script>

<style scoped>
.mytable {
  height: 90vh;
  /* width: 30vw; */
}
</style>
