import Vue from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.css'
import './assets/css/style.css'
import Clipboard from 'v-clipboard'
import VTooltip from 'v-tooltip'

Vue.config.productionTip = false
Vue.use(Clipboard)
Vue.use(VTooltip)

new Vue({
  render: h => h(App),
}).$mount('#app')