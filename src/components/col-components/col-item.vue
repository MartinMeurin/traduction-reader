<template>
  <nav v-bind:class="{ active:col.active }" @click.prevent="clickOnNav" class="col-md-2 d-none d-md-block sidebar bg-light">
    <div class="sidebar-sticky">
      <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-4 text-muted">
        <span>col-{{col.id}}</span>
        <button type="button" class="" data-toggle="modal" data-target="#addItemModal" @click.prevent="addModale"><span data-feather="plus"></span></button>
      </h6>
      <ul class="nav flex-column mb-2">
        <translate-item v-for="value in col.value" :translateitem="value" :colNumber="col.id" :key="value.id" @navigate-item="navigateitem"></translate-item>
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
    data(){
      return{
        isNotNav:false
      }
    },
    methods:{
      clickOnNav() {
        if(!this.isNotNav){
          this.$emit('navigate',{col:this.col.id, source:'nav'})
        }else{
          this.isNotNav = false;
        }
        /*app.statusClick.col = this.col.id;
        if(!app.statusClick.button){
          app.navigate();
        }
        app.resetStatusClick();*/
      },
      addModale(){
        /*app.statusClick.col = this.col.id;
        app.resetStatusInput();
        // Préremplir le champ
        let val = '/';
        for(var i=0; i<app.cols.length-1; i++){
          val += app.cols[i].selected.label+'/'; 
        }
        document.getElementById('Inputlabel').value = val;
        document.getElementById('InputContent').value = '';
        window.setTimeout(function () {
            document.getElementById("Inputlabel").focus();
        },1000);
        */
      },
      navigateitem(event){
        this.isNotNav = true;
        this.$emit('navigate',event);
      }
    }
  }

</script>
