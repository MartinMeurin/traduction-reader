import Vue from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './assets/css/style.css'
import Clipboard from 'v-clipboard'
import VTooltip from 'v-tooltip'
import { BootstrapVue, IconsPlugin, BootstrapVueIcons } from 'bootstrap-vue'
import VueHotkey from 'v-hotkey'

Vue.config.productionTip = false
Vue.use(Clipboard)
Vue.use(VTooltip)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(BootstrapVueIcons)
Vue.use(VueHotkey)

new Vue({
  render: h => h(App),
}).$mount('#app')