<template>
  <nav :class="{ active:col.active }" @click.prevent="navigateitem({idCol:col.id})" class="col-md-2 d-none d-md-block sidebar bg-light">
    <div class="sidebar-sticky">
      <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-2 mb-2 text-muted">
        <span>col-{{col.id}}</span>
        <!--<button type="button" class="" data-toggle="modal" data-target="#addItemModal"><b-icon icon="plus" class="icon"></b-icon></button>-->
      </h6>
      <ul class="nav flex-column mb-2">
        <translate-item v-for="(value,index) in col.value" :translateitem="value" :colNumber="col.id" :key="value.id" @navigate-item="navigateitem" :index="index" @modale="modale" @deleteItem="deleteItem"></translate-item>
      </ul>
    </div>
  </nav>
</template>

<script>
  import TranslateItem from './translate-item.vue'

  export default{
    components:{
      TranslateItem
    },
    props:{
      col:Object
    },
    methods:{
      navigateitem(event){
        this.$emit('navigate',event)
      },
      modale(event){
        this.$emit('modale',event)
      },
      deleteItem(event){
        this.col.value.splice(event.index,1)
        this.$emit('deleteItem',event.translateItem)
      }
    }
  }

</script>
