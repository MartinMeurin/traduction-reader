<template>
 <div id="app">
    <modale :translateitem="modalecontent"></modale>
  <div class="container-fluid">
    <div class="row">
      <col-item v-for='col in cols' :col='col' :key="col.id" @navigate="navigate" @modale="modale"></col-item>
    </div>
  </div>
  <div class="btn-group">
    <button type="button" class="btn btn-langue dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      <!--{{currentLanguage.name}}-->
    </button>
    <div class="dropdown-menu">
      <!--<translate-file v-for='file in fileData' v-bind:translatefile='file' v-bind:key="file.id"></translate-file>-->
    </div>
  </div>
</div>
</template>

<script>
  import ColItem from './components/col-components/col-item'
  import data from './data/es-ES.json'
  import feather from 'feather-icons'
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
        modalecontent:{label:''}
      }
    },
    methods: {
      modale(event){
        this.modalecontent={...event};
        this.$bvModal.show("bvModal")
        //this.$refs.modal.open()
      },
      ///EVENT
      navigate(event){
        let colID = event.col;
        let id = event.id;
        let label = event.label;

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
      ////
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
        let data = {};
        for (var value in jsonData){
          if (!Array.isArray(jsonData[value]) || typeof jsonData[value] !== 'object') {
            this.setItem(data, value.split('.'), jsonData[value]);
          }
        }
        return data;
      },
      setItem(data, dataSplit,value){
        let items = data;
        dataSplit.forEach((label,i)=>{
          if(typeof items[label] !== 'undefined' &&  typeof items[label] !== 'string'){ items = items[label]; }
          else {
            if( i == dataSplit.length-1 ){
              items[label] = value;
            }else{
              items[label] = { };
              items = items[label];
            }
          }
        })
      },
      createCol(data,idCol){
        this.cols.forEach(col=>{
          col.active = false;
        })

        let itemsCol = this.getDataCol(data);

        //create
        if(idCol === undefined) this.cols.push({ "id":(this.cols.length), "active":false, "value":itemsCol });
        //updateData ---- /!\ tester si j'ai le même jeux de data /!\
        if(idCol != undefined){ 
          this.cols[idCol].value = itemsCol;
        }

        this.cols[this.cols.length-1].active = true;
        this.$nextTick(() => { 
          feather.replace();
          //jQuery('[data-toggle="tooltip"]').tooltip();
        })
      },
      getDataCol(data){
        let itemsCol = [];
        let endItems = [];
        let item = '';
        let count = 0;
        for(let label in data){
          let idItem = this.cols.length+""+count+""+label;
          item = { "id":idItem, "position":count, "label":label, "current":false, "active":false }
          if(typeof data[label] === 'string'){ 
            item.value = data[label]; 
            endItems.push(item);
          } else {
            itemsCol.push(item);
            count++;
          }
          
        }
        // place end item to the end of the list
        for(let i=0; i < endItems.length; i++){
          endItems[i].id = count++;
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
    }
  }
</script>
