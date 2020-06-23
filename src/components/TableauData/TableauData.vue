<template>
	<div class="container-fluid">
		<div class="row">
			<ColItem v-for='col in cols' v-bind:col='col' v-bind:key="col.id"></ColItem>
		</div>
	</div>
</template>

<script>
  import ColItem from './components/TableauData/ColItem.vue'

  export default {
    name: 'TableauData',
    components: {
      ColItem
    },
    props: {
      cols: Array,
    }
  }
</script>