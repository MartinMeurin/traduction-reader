<template>
  <li class="nav-item">
    <a v-if="translateitem.value" href="#" @click.prevent.stop="modale">
      <span class="nav-link boldLabel">
        {{ translateitem.label }}
        <b-icon icon="pencil-square" class="icon"></b-icon>
      </span>
      <span class="nav-link finalLabel" v-clipboard="translateitem.value" v-clipboard:success="clipboardSuccessHandler" v-tooltip="{ content:toolTipContent, hideOnTargetClick:false}" data-placement="top">
        {{ translateitem.value }}
      </span>
    </a>
    <a v-else @click.prevent.stop="gotToCol(colNumber,translateitem.position,translateitem.label)" :class="{ active : translateitem.active, current : translateitem.current}" class="nav-link" href="#"> 
      {{ translateitem.label }}
      <b-icon icon="chevron-right" class="icon"></b-icon>
    </a>
  </li>
</template>
<script>
  export default{
    props:{
      colNumber:Number,
      translateitem:Object,
    },
    data(){
      return{
        toolTipContent: "Click to copy",
      }
    },
    methods:{
      gotToCol(colNumber,id,label){
        this.$emit('navigate-item',{col:colNumber,id,label});
      },
      clipboardSuccessHandler(){
        this.toolTipContent = "Copied !"
        setTimeout(()=>{
          this.toolTipContent = "Click to copy"
        }, 2000);
      },
      editElement(){

      },
      modale(){
        this.gotToCol(this.colNumber);
        this.$emit('modale',this.translateitem)
      }
    }
  }
</script>