<template>
  <li class="nav-item">
    <a v-if="translateitem.value" href="#" @click.prevent.stop="gotToCol(colNumber)">
      <span class="nav-link boldLabel" @click.prevent.stop="editElement">
        {{ translateitem.label }}
        <span data-feather="edit-2"></span>
      </span>
      <span class="nav-link finalLabel" v-clipboard="translateitem.value" v-clipboard:success="clipboardSuccessHandler" v-tooltip="{content:toolTipContent,hideOnTargetClick:false}" data-placement="top" @click.prevent.stop="copyElement">
        {{ translateitem.value }}
      </span>
    </a>
    <a v-else @click.prevent.stop="gotToCol(colNumber,translateitem.position,translateitem.label)" :class="{ active : translateitem.active, current : translateitem.current}" class="nav-link" href="#"> 
      {{ translateitem.label }}
      <span data-feather="chevron-right"></span>
    </a>
  </li>
</template>
<script>
  export default{
    props:{
      colNumber:Number,
      translateitem:Object
    },
    data(){
      return{
        toolTipContent: "Click to copy"
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

      }
    }
  }
</script>