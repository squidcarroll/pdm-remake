import Vue from 'vue'
import App from './App'
import store from './store'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default-dark.css'
import Winston from 'winston'

Vue.use(VueMaterial)
Vue.use(Winston)

const fs = require('fs')
const path = require('path')
const filename = path.join(__dirname, 'created-logfile.log')

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

Vue.prototype.$logger = Winston.createLogger({
  level: 'info',
  format: Winston.format.json(),
  transports: [
    new Winston.transports.File({ filename }),
    new Winston.transports.Console({
      format: Winston.format.simple()
    })
  ]
})

/* eslint-disable no-new */
new Vue({
  components: { App },
  store,
  template: '<App/>'
}).$mount('#app')
