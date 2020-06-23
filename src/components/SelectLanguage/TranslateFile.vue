<template>
	<a v-on:click="changeLabel" class="dropdown-item" data-url="translatefile.url" href="#">{{translatefile.name}}</a>
</template>


<script>
	export default {
		name: 'TranslateFile',
		props: {
			translatefile: Object,
			currentLanguage : Object,
			updateNavContent: Function,
		},
		methods:{
			changeLabel: function(){
				//app.currentLanguage = this.translatefile;
				//app.updateNavContent()
				this.currentLanguage = this.translatefile;
				this.updateNavContent()
			}
		}
	}	
</script>

<style scoped>
</style>