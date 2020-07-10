<template>
	<b-dropdown-item-button v-if="isShow" :active="isActive" :alt="file.url" @click.prevent="selectFile">{{file.label}}</b-dropdown-item-button>
</template>

<script>
  export default{
    props:{
      file:Object,
      isShow:Boolean,
      isActive:Boolean
  },
  methods:{
   selectFile(){
        //this.file.key +=1
        this.$emit('selectFile',this.file)
     }
  }
}
</script>

<style>
    .dropdownMenu{
        min-width:120px;
        text-align: left;
    }
</style>