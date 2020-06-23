<template>
	<div class="btn-group">
		<button type="button" class="btn btn-langue dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
			{{currentLanguage}}
			<!--{{app.currentLanguage.name}}-->
		</button>
		<div class="dropdown-menu">
			<translateFile v-for='file in fileData' v-bind:translateFile='file' v-bind:key="file.id"></translateFile>
		</div>
	</div>
</template>

<script>
	import translateFile from './TranslateFile.vue'
	export default {
		name: 'SelectLanguage',
		components: {
			translateFile
		},
		props: {
			fileData : Array,
			currentLanguage : String
		}
	}
</script>

<style scoped>
</style>