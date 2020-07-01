<template>
 <div id="app">
  <modale :translateitem="modalecontent"></modale>
  <div class="container-fluid">
    <div class="row" v-hotkey.stop="keymap">
      <col-item v-for='col in cols' :col='col' :key="col.id" @navigate="updateCurrentItem" @modale="modale" ></col-item>
    </div>
  </div>
  <b-button-toolbar key-nav aria-label="Toolbar with button groups">
    <b-button-group class="mx-1">
      <b-button variant="primary"> Add item </b-button>
    </b-button-group>
    <b-dropdown id="dropdown-1" class="mx-1" right text="Dropdown Button">
        <b-dropdown-group id="dropdown-group-1" header="Json">
          <b-dropdown-item-button active>🇪🇸 es-ES</b-dropdown-item-button>
        </b-dropdown-group>
        <b-dropdown-divider></b-dropdown-divider>
        <b-dropdown-group id="dropdown-group-1" header="Xlif">
          <b-dropdown-item-button>xlif file</b-dropdown-item-button>
        </b-dropdown-group>
        <!--<translate-file v-for='file in fileData' v-bind:translatefile='file' v-bind:key="file.id"></translate-file>-->
    </b-dropdown>
  </b-button-toolbar>
</div>
</template>

<script>
  import ColItem from './components/col-components/col-item'
  import data from './data/es-ES.json'
  import modale from './components/modale.vue'

  export default {
    name: 'App',
    components: {
      ColItem,
      modale
    },
    data(){
      return{
        cols:[],
        fileData:[],
        currentLanguage:{},
        modalecontent:{label:''},
        currentItem:{idCol:0}
      }
    },
    
    methods: {
      ///KEYEVENT
      navigateKey(event){
        let curridCol = 0;
        let position = 0;
        const key = event.key;
        if(typeof this.currentItem?.position === 'number'){
          curridCol = this.currentItem.idCol;
          position = this.currentItem.position;
          if(key == "ArrowDown" && position !== this.cols[curridCol].value.length-1){
              if(this.cols[curridCol].value[position+1].value === undefined) position += 1;
          }
          if(key == "ArrowUp" && position !==0){
            if(this.cols[curridCol].value[position-1].value === undefined) position -= 1;
          }
          if(key == "ArrowLeft" && curridCol !==0){
            position = this.cols[curridCol-1].selected.id;
            curridCol-=1;
          }
          if(key == "ArrowRight"){
            if(this.cols[curridCol+1].value[0].value === undefined){
              curridCol += 1;
              position = 0;
            }
          }
        }
        this.updateCurrentItem(this.cols[curridCol].value[position]);
      },
      ///END KEYEVENT
      ///EVENT
      modale(event){
        this.modalecontent={...event};
        this.$bvModal.show("bvModal")
        //this.$refs.modal.open()
      },
      updateCurrentItem(event){
        if(event?.id){
          this.currentItem = event;
        }else{
          if(event.idCol > 0){
            const curridCol = this.cols[event.idCol-1]?.selected ? event.idCol-1 : event.ideCol-2;
            const selectedId = this.cols[curridCol].selected.id;
            this.currentItem = this.cols[curridCol].value[selectedId];
          }else{
            this.currentItem = {idCol:0};
          }
        }
        this.navigate()
      },
      navigate(){
        let colID = this.currentItem.idCol;
        let id = this.currentItem.position;
        let label = this.currentItem.label;

        this.resetCurrentStatuts();
        // remove all colonne after
        this.cols.splice(colID+1,this.cols.length-(colID+1));
        
        // set selected cols
        this.cols[colID].selected = {"id":id, "label":label};
        this.setLabelStatus(colID,id);

        // create new nav
        if(typeof id === 'number'){
          this.createCol({...this.getDataSet()});
        }else{
          // reactiver la dernière nav
          this.cols[this.cols.length-1].active = true;
        }

        // setting blue label à la fin de l'update
        if(this.cols.length>1){
          let lastCol = this.cols[this.cols.length-2];
          lastCol.value[lastCol.selected.id].current = true;
        }
      },
      //// END EVENT
      resetCurrentStatuts() {
        this.cols.forEach(col => {
          const idSelected = col.selected?.id;
          typeof idSelected === 'number' ? col.value[idSelected].current = false : false;
        })
      },
      setLabelStatus(colID,id){
        this.cols[colID].value.forEach((value,i) => (value.active = typeof id==='number' && i == id))
      },
      getDataSet(){
        let data = {...this.fileData[this.currentLanguage.id].dataSetOrganise};
        this.cols.forEach(col=> (data = data[ col.selected.label ]))
        return data;
      },
      ///
      organiseDataStructure(jsonData){
        let dataSet = {};
        for (const item in jsonData){
          if (!Array.isArray(jsonData[item]) || typeof jsonData[item] !== 'object') {
            this.setItem(dataSet, item, jsonData[item]);
          }
        }
        return dataSet;
      },
      setItem(dataSet,path,value){
        let items = dataSet;
        const pathSplit = path.split('.')
        pathSplit.forEach((label,i)=>{
          if(typeof items[label] !== 'undefined' &&  typeof items[label] !== 'string'){ items = items[label]; }
          else {
            if( i == pathSplit.length-1 ){
              items[label] = {path,value};
            }else{
              items[label] = { };
              items = items[label];
            }
          }
        })
      },
      createCol(data){
        this.cols.forEach(col=>{
          col.active = false;
        })

        let itemsCol = this.getDataCol(data);

        //create
        //if(idCol === undefined) 
        this.cols.push({ "id":(this.cols.length), "active":false, "value":itemsCol });
        //updateData ---- /!\ tester si j'ai le même jeux de data /!\
        /*if(idCol != undefined){
          this.cols[idCol].value = itemsCol;
        }*/
        this.cols[this.cols.length-1].active = true;
      },
      getDataCol(data){
        let itemsCol = [];
        let endItems = [];
        let item = '';
        let position = 0;
        for(let label in data){
          const id = this.cols.length+""+position+""+label;
          const idCol = this.cols.length;
          item = {id,position,idCol,label,current:false,active:false }
          if(data[label]?.value){ 
            item.value = data[label].value;
            item.path = data[label].path;
            endItems.push(item);
          } else {
            itemsCol.push(item);
            position++;
          }
          
        }
        // place end item to the end of the list
        for(let i=0; i < endItems.length; i++){
          endItems[i].id = position++;
          itemsCol.push( endItems[i] );
        }
        return itemsCol;
      },
      ///
      initApp(){
        this.currentLanguage = this.fileData[0];
        this.createCol({...this.currentLanguage.dataSetOrganise});
      }
    },
    created(){
      this.fileData.push({ id:0, name:'es-ES', extension:'json', dataSet:data, dataSetOrganise:this.organiseDataStructure(data)})
      this.initApp();
    },
    computed: {
      keymap () {
        return {
          'up': { keydown:this.navigateKey },
          'down': { keydown:this.navigateKey },
          'right': { keydown:this.navigateKey },
          'left': { keydown:this.navigateKey }
        }
      }
    },
  }
</script>
