<template>
 <div id="app">
  <modale :modalecontent="modalecontent" @validModale="validModale"></modale>
  <div class="container-fluid">
    <div class="row" v-hotkey.stop="keymap">
      <col-item v-for='col in cols' :col='col' :key="col.id" @navigate="updateCurrentItem" @modale="modale" @deleteItem="deleteItem"></col-item>
    </div>
  </div>
  <b-button-toolbar id='root-toolbar'>
    <b-button-group class="mx-1">
      <b-button variant="primary" v-on:click="addElement"> Add item </b-button>
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
        currentItem:{nav:{idCol:-1}}
      }
    },
    
    methods: {
      ///KEYEVENT
      navigateKey(event){
        let curridCol = 0;
        let position = 0;
        const key = event.key;
        const currItemNav = this.currentItem.nav;
        if(typeof currItemNav?.position === 'number'){
          curridCol = currItemNav.idCol;
          position = currItemNav.position;
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
        this.modalecontent = {...event};
        this.showModal();
      },
      validModale(event){
        const path = event.path;
        const value = event.value;
        const isExist = this.currentLanguage.dataSet[path] ? true:false;
        this.setItem(this.currentLanguage.dataSetOrganise,path,value);
        this.setItem(this.fileData[this.currentLanguage.id].dataSetOrganise,path,value);
        if(isExist){
          const item = this.cols[event.idCol].value[event.id]
          if(item){
            if(item.label === event.label) item.value = event.value;
          }
          this.currentLanguage.dataSet[path] = event.value;
          this.fileData[this.currentLanguage.id].dataSet[path] = event.value;
        }
        else{
          this.currentLanguage.dataSet[path] = event.value;
          this.organiseCol(path);
        }
        updateOriginalDataSet();
        
        //this.cols[event.idCol].value[event.id].content = ;
      },
      updateOriginalDataSet(){
        this.fileData[this.currentLanguage.id] = this.currentLanguage;
        // update original File
      },
      organiseCol(path){
        this.cols=[];
        this.createCol();
        const pathSplit =  path.split('.')
        pathSplit.splice(-1,1);
        pathSplit.forEach((label,i)=>{
            this.cols[i].value.forEach(item=>{
              if(label === item.label){
                this.currentItem.nav = item;
              }
            })
            this.navigate()
        });
        
      },
      deleteItem(event){
        this.cols[event.idCol].value.splice(event.id,1)
        delete this.currentLanguage.dataSet[event.path];
        // remove from the file
      },
      updateCurrentItem(event){
        if(event.value != undefined){
          this.currentItem.item = event
        }
        // on click sur une nav
        let currentNav = event;
        // on click sur une colonne ou une entrée
        if(event.id == undefined || event.value != undefined ){
          if(event.idCol > 0){
            const curridCol = this.cols[event.idCol-1]?.selected ? event.idCol-1 : event.idCol-2;
            const selectedId = this.cols[curridCol].selected.id;
            currentNav = this.cols[curridCol].value[selectedId];
          }else{
            currentNav = {idCol:0};
          }
        }
        this.currentItem.nav = currentNav;
        this.navigate()
      },
      //// END EVENT
       addElement(){
        this.modalecontent = {...this.currentItem.nav};
        this.showModal();
      },
      showModal(){
        this.$bvModal.show("bvModal")
      },
      navigate(){
        const colID = this.currentItem.nav.idCol;
        const id = this.currentItem.nav.position;
        const label = this.currentItem.nav.label;

        this.resetCurrentStatuts();
        // remove all colonne after
        this.cols.splice(colID+1,this.cols.length-(colID+1));

        this.cols[colID].selected = {"id":id, "label":label};
        this.setLabelStatus(colID,id);

        // create new nav
        if(typeof id === 'number'){
          this.createCol();
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
        let path = "";
        this.cols.forEach(col=> {
          data = data[ col.selected.label ]
          path += col.selected.label+".";
        })
        return {data,path};
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
          if(typeof items[label] !== 'undefined' &&  typeof items[label].path !== 'string'){ items = items[label]; }
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
      createCol(){
        this.cols.forEach(col=>{
          col.active = false;
        })
        let itemsCol = this.getDataCol();
        //create
        //if(idCol === undefined) 
        this.cols.push({ "id":(this.cols.length), "active":false, "value":itemsCol });
        //updateData ---- /!\ tester si j'ai le même jeux de data /!\
        /*if(idCol != undefined){
          this.cols[idCol].value = itemsCol;
        }*/
        this.cols[this.cols.length-1].active = true;
      },
      getDataCol(){
        const dataSet = this.getDataSet()
        const data = dataSet.data;
        let pathSource = dataSet.path;
        let itemsCol = [];
        let endItems = [];
        let item = '';
        let position = 0;
        for(let label in dataSet.data){
          const id = this.cols.length+""+position+""+label;
          const idCol = this.cols.length;
          let path = `${pathSource}${label}.`;
          item = {id,position,path,idCol,label,current:false,active:false}
          if(data[label]?.value){ 
            item.value = data[label].value;
            item.path = item.path.substring(0, item.path.length - 1);
            endItems.push(item);
          } else {
            path += '.';
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
        this.createCol();
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
