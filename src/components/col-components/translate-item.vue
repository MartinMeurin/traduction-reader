<template>
  <li class="nav-item">
    <a v-if="translateitem.value === undefined" @click.prevent="gotToNextLevel" :class="{ active : translateitem.active, current : translateitem.current}" class="nav-link" href="#"> 
      {{ translateitem.label }}
      <span data-feather="chevron-right"></span>
    </a>
    <a v-if="translateitem.value" href="#">
      <span class="nav-link boldLabel" @click.prevent="editElement">
        {{ translateitem.label }}
        <span data-feather="edit-2"></span>
      </span>
      <span class="nav-link finalLabel" data-toggle="tooltip" data-placement="top" title="Click to copy" @click.prevent="copyElement">
        {{ translateitem.value }}
      </span>
    </a>
  </li>
</template>
<script>
  export default{
    props:{
      colNumber:Number,
      translateitem:Object
    },
    methods:{
      gotToNextLevel: function(){
        this.$emit('navigate-item',{col:this.colNumber,id:this.translateitem.position,label:this.translateitem.label, source:'keytrad'});
        /*app.statusClick.col = this.col;
        app.statusClick.button = {"col":this.col,"id":this.translateitem.position, "label":this.translateitem.label};
        app.navigate();
        jQuery('[data-toggle="tooltip"]').tooltip('hide');*/
      },
      copyElement: function () {
        // Empecher que la colonne réalise un navigate
        /*let currentElement = this.$el.lastElementChild.lastElementChild;
        console.log(this.$el);
        jQuery(currentElement).tooltip('show');
        app.copyToClipboard(this.translateitem.value);
        jQuery(currentElement).attr('data-original-title', "Copied !").tooltip('show');*/
      },
      editElement:function(){

      }
    }
  }
</script>