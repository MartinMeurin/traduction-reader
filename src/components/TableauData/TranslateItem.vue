<template>
  <li class="nav-item">
      <a v-if="translateitem.value === undefined" v-on:click="gotToNextLevel" v-bind:class="{ active : translateitem.active, current :translateitem.current}" class="nav-link" href="#"> 
        {{ translateitem.label }} 
        <span data-feather="chevron-right"></span>
      </a>
      <a v-if="translateitem.value" href="#">
        <span class="nav-link boldLabel" v-on:click="editElement">
          {{ translateitem.label }} 
          <span data-feather="edit-2"></span>
        </span> 
        <span class="nav-link finalLabel" data-toggle="tooltip" data-placement="top" title="Click to copy" v-on:click="copyElement">
          {{ translateitem.value }}
        </span>
      </a>
  </li>
</template>
<script>
  export default {
    name: 'TranslateItem',
    props: {
      translateitem: Array
    },
    methods: {
      gotToNextLevel: function(event){
        app.statusClick.col = this.col;
        app.statusClick.button = {"col":this.col,"id":this.translateitem.position, "label":this.translateitem.label};
        app.navigate();
        jQuery('[data-toggle="tooltip"]').tooltip('hide');
      },
      copyElement: function (event) {
        // Empecher que la colonne réalise un navigate
        //app.statusClick.button = true;
        let currentElement = this.$el.lastElementChild.lastElementChild;
        console.log(this.$el);
        jQuery(currentElement).tooltip('show');
        app.copyToClipboard(this.translateitem.value);
        jQuery(currentElement).attr('data-original-title', "Copied !").tooltip('show');
      },
      editElement:function(event){

      }
    }
  }
</script>