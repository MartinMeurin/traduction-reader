<template>
  <nav v-bind:class="{ active:col.active }" v-on:click="clickOnNav" class="col-md-2 d-none d-md-block sidebar bg-light">
    <div class="sidebar-sticky">
      <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-4 text-muted">
        <span>col-{{col.id}}</span>
        <button type="button" class="" data-toggle="modal" data-target="#addItemModal" v-on:click="addModale"><span data-feather="plus"></span></button>
      </h6>
      <ul class="nav flex-column mb-2">
        <TranslateItem v-for="value in col.value" v-bind:translateitem="value" v-bind:col="col.id" v-bind:key="value.id" statusClick=statusClick navigate=navigate></TranslateItem>
      </ul>
    </div>
  </nav>
</template>

<script>
  import TranslateItem from './TranslateItem.vue'

  export default {
    name: 'ColItem',
    components: {
      TranslateItem
    },
    props: {
      col: Object,
      cols:Array,
      statusClick:Object,
      resetStatusClick:Function,
      navigate:Function,
    },
    methods:{
      clickOnNav: function () {
        this.statusClick.col = this.col.id;
        if(!this.statusClick.button){
          this.navigate();
        }
        this.resetStatusClick();
      },
      addModale:function(){
        this.statusClick.col = this.col.id;
        this.resetStatusInput();
        // Préremplir le champ
        let val = '/';
        for(var i=0; i<this.cols.length-1; i++){
          val += this.cols[i].selected.label+'/'; 
        }

        // /!\ Réintégrer en tant qu'element vuejs dans MODALE/!\
        document.getElementById('Inputlabel').value = val;
        document.getElementById('InputContent').value = '';
        // FIN

        window.setTimeout(function () {
          document.getElementById("Inputlabel").focus();
        },1000);
      },
    }
  }
</script>