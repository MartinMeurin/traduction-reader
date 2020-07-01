<template>
  <li class="nav-item">
    <a v-if="translateitem.value" href="#">
      <span class="nav-link boldLabel" @click.prevent.stop="modale">
        {{ translateitem.label }}
        <span class="icon"><b-icon icon="pencil" ></b-icon></span>
      </span>
      <span class="nav-link finalLabel" v-clipboard="translateitem.value" v-clipboard:success="clipboardSuccessHandler" v-tooltip="{ content:toolTipContent, hideOnTargetClick:false}" data-placement="top">
        {{ translateitem.value }}
      </span>
    </a>
    <a v-else @click.prevent.stop="gotToCol()" :class="{ active : translateitem.active, current : translateitem.current}" class="nav-link" href="#"> 
      <span>{{ translateitem.label }}</span>
      <span class="icon"><b-icon icon="caret-right-fill"></b-icon></span>
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
        this.$emit('navigate-item',this.translateitem);
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
        const modalSend = this.translateitem;
        modalSend.source = "item";
        this.$emit('modale',modalSend)
      }
    }
  }
</script>