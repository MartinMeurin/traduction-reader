<template>
  <li class="nav-item">
    <a v-if="translateitem.value === undefined" v-on:click="gotToNextLevel" v-bind:class="{ active : translateitem.active, current :translateitem.current}" class="nav-link" href="#"> 
      {{ translateitem.label }} 
      <span data-feather="chevron-right"></span>
    </a>
    <a v-if="translateitem.value" href="#">
      <span class="nav-link boldLabel" v-on:click="editElement">
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
      translateitem: Array,
    },
    methods: {
      gotToNextLevel: function(){
        this.$root.statusClick.col = this.col;
        this.$root.statusClick.button = {"col":this.col,"id":this.translateitem.position, "label":this.translateitem.label};
        this.$root.navigate();
        window.jQuery('[data-toggle="tooltip"]').tooltip('hide');
      },
      copyElement: function () {
        // Empecher que la colonne réalise un navigate
        //app.statusClick.button = true;
        let currentElement = this.$el.lastElementChild.lastElementChild;
        console.log(this.$el);
        window.jQuery(currentElement).tooltip('show');
        this.copyToClipboard(this.translateitem.value);
        window.jQuery(currentElement).attr('data-original-title', "Copied !").tooltip('show');
      },
      editElement:function(){

      },
      copyToClipboard(str){
        const el = document.createElement('textarea');
        el.value = str;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }
    }
  }
</script>