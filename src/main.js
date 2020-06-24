import Vue from 'vue'
import App from './App.vue'


Vue.config.productionTip = false

window.$ = window.jQuery = require('jquery');

new Vue({
	data:{
		statusClick:{ col:false , button:false },
	},
	render: h => h(App),

}).$mount('#app')
