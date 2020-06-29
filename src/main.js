import Vue from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './assets/css/style.css'
import Clipboard from 'v-clipboard'
import VTooltip from 'v-tooltip'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

Vue.config.productionTip = false
Vue.use(Clipboard)
Vue.use(VTooltip)
new Vue({
  render: h => h(App),
}).$mount('#app')