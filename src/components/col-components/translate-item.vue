<template>
  <li class="nav-item">
    <a v-if="translateitem.value" href="#"  @mouseleave="isTrash = true">
      <span class="nav-link boldLabel">
        <span class="pr-2" @click.prevent.stop="modale"> {{ translateitem.label }}</span>
        <span v-if='isTrash' class="icon text-primary ml-0 mr-2" @click.prevent.stop="modale"><b-icon icon="pencil" ></b-icon></span>
        <span v-if='isTrash' class="icon text-danger ml-0 mr-2" @click.prevent.stop="isTrash=!isTrash"><b-icon icon="trash" ></b-icon></span>
        <span v-if='!isTrash' class="icon text-success ml-0 mr-2" @click.prevent.stop="deleteItem"><b-icon icon="check"></b-icon></span>
        <span v-if='!isTrash' class="icon text-secondary ml-0" @click.prevent.stop="isTrash=!isTrash"><b-icon icon="x"></b-icon></span>
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
      index:Number
    },
    data(){
      return{
        toolTipContent: "Click to copy",
        isTrash:true,
      }
    },
    methods:{
      gotToCol(){
        this.$emit('navigate-item',this.translateitem);
      },
      clipboardSuccessHandler(){
        this.toolTipContent = "Copied !"
        setTimeout(()=>{
          this.toolTipContent = "Click to copy"
        }, 2000);
      },
      modale(){
        this.gotToCol();
        const modalSend = this.translateitem;
        modalSend.source = "item";
        this.$emit('modale',modalSend)
      },
      deleteItem(){
        this.$emit('deleteItem',{translateItem:this.translateitem,index:this.index})
      }
    }
  }
</script>