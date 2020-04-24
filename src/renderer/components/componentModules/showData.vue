/* eslint-disable */
<template>
  <div class="md-layout md-gutter">
    <div class="md-layout-item md-size-20">
      <div id="rpm" class="g"></div>
      <h3>RPM_REF: {{ yData.rpm_ref_display.data }}</h3>
      <h3>RPM_COM: {{ yData.rpm_com.data }}</h3>
    </div>
    <div class="md-layout-item">
      <Chart :randData="yData.rpm_snapshot.data"></Chart>
    </div>
    <div class="md-layout-item">
      <md-table class="mytable">
        <md-table-toolbar>
          <h1 class="md-title" md-fixed-header>
            <md-button
              @click="swap('dataView')"
              :md-ripple="false"
              :disabled="tabs.dataView"
              >Data</md-button
            >
          </h1>
          <h1 class="md-title" md-fixed-header>
            <md-button
              @click="swap('permView')"
              :md-ripple="false"
              :disabled="tabs.permView"
              >Permissives</md-button
            >
          </h1>
          <h1 class="md-title" md-fixed-header>
            <md-button
              @click="swap('flagView')"
              :md-ripple="false"
              :disabled="tabs.flagView"
              >Flags</md-button
            >
          </h1>
        </md-table-toolbar>

        <template v-if="tabs.dataView" v-for="(value, key) in yData">
          <md-table-row>
            <md-table-cell>{{ key }}</md-table-cell>
            <md-table-cell>{{ value.data }}</md-table-cell>
          </md-table-row>
        </template>
        <template v-if="tabs.permView" v-for="(value, key) in getPerms">
          <md-table-row>
            <md-table-cell>{{ key }}</md-table-cell>
            <md-table-cell>{{ value }}</md-table-cell>
          </md-table-row>
        </template>
        <template v-if="tabs.flagView" v-for="(value, key) in getFlags">
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
import Data from './modules/Objects.js'
import Login from './modules/login'
import JustGage from 'justgage'
import Log from './modules/fileSave'
import byte from 'bitwise/byte'
import Chart from './chart'

const fs = require('fs')

export default {
  name: 'showData',
  props: [],
  components: {
    Chart
  },
  data() {
    return {
      yData: Data.oper_stat,
      tabs: {
        dataView: true,
        permView: false,
        flagView: false
      }
      // randData: 0
    }
  },
  created() {
    // setInterval(() => {
    //   this.randData = Math.random() * 1000
    // }, 500)
  },
  mounted() {
    // console.log(this.yData);
    // console.log(this.$store.commit('change', true))
    console.log(this.$store)
    console.log(this.$store.getters.logginState)
    this.$store.dispatch('changeLogginState', true)
    console.log(this.$store.getters.logginState)

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
  computed: {
    getPerms: function() {
      let p = Object.assign(
        {},
        this.yData['permissives'].bytes['permis_byte_hi'].data,
        this.yData['permissives'].bytes['permis_byte_lo'].data,
        this.yData['permissives1'].bytes['permis1_byte_hi'].data,
        this.yData['permissives1'].bytes['permis1_byte_lo'].data,
        this.yData['permissives2'].bytes['permis2_byte_hi'].data,
        this.yData['permissives2'].bytes['permis2_byte_lo'].data
      )
      // console.log("THESE ARE THE PERMS", p);
      return p
    },

    getFlags: function() {
      let obj = {}
      for (let byte in this.yData['flags'].bytes) {
        Object.assign(obj, this.yData['flags'].bytes[byte].data)
      }
      // console.log("THESE ARE THE FLAGS", obj);
      return obj
    }
  },
  methods: {
    swap: function(view) {
      for (let x in this.tabs) {
        this.tabs[x] = false
      }
      this.tabs[view] = true
    },
    setData: function(recData) {
      // console.log("REC", recData);
      // console.log("ydata length", this.yData);
      for (let x in this.yData) {
        // console.log(myObj[x].dataLen);
        if (this.yData[x].dataLen == 1) {
          //read and store bytes
          this.yData[x].data = recData.readInt8(this.yData[x].byte)
        } else if (this.yData[x].dataLen == 2) {
          //read and store words
          this.yData[x].data = recData.readInt16BE(this.yData[x].byte)
        } else if (this.yData[x].dataLen == 0) {
          //read and store bits
          let bits = []
          for (let b in this.yData[x].bytes) {
            let arr = byte.read(recData[this.yData[x].bytes[b].byte])
            let n = 0
            for (let c in this.yData[x].bytes[b].data) {
              this.yData[x].bytes[b].data[c] = arr[n]
              n++
            }
          }
        } else {
          console.log('failed to write data to', x)
        }
      }
      // this.$logger.log("info", this.yData);
    },
    dataHandler: function(data) {
      //must change later to direct data to correct locations
      //if cmd y
      let cmd = String.fromCharCode(data[0])
      if (data[0] == data[1]) {
        if (Login.validCmds.hasOwnProperty(cmd)) {
          let justDataBuf = data.slice(2)
          console.log('just data', justDataBuf)
          console.log('received', cmd)
          this.setData(justDataBuf)
        }
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
.g {
  width: 60%;
}
#chart {
  background-color: white;
}
</style>
