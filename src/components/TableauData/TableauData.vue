<template>
	<div class="container-fluid">
		<div class="row">
			<ColItem v-for='col in cols' v-bind:col='col' v-bind:key="col.id" statusClick=statusClick resetStatusClick=resetStatusClick navigate=navigate cols=cols></ColItem>
		</div>
	</div>
</template>

<script>
  import ColItem from './ColItem.vue'

  export default {
    name: 'TableauData',
    components: {
      ColItem
    },
    props: {
      cols: Array,
      statusClick:Object,
      resetStatusClick:Function,
      navigate:Function
    }
  }
</script>