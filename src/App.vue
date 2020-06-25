<template>
 <div id="app">
  <div class="modal fade" id="addItemModal" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <form class="needs-validation" novalidate>
          <div class="modal-header">
            <h5 class="modal-title" id="modalLabel">Add traduction key</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="Inputlabel">Label</label>
              <input type="texte" class="form-control" id="Inputlabel" aria-describedby="labelHelp" required>
              <small id="labelHelp" class="form-text text-muted">You can use "/" to add colonne</small>
              <div class="invalid-feedback" id="labelInvalid">
                The label is missing 
              </div>
            </div>
            <div class="form-group">
              <label for="InputContent">Content</label>
              <input type="texte" class="form-control" id="InputContent" required>
              <div class="invalid-feedback" id="contentInvalid">
                The content is missing
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <!--<button type="button" class="btn btn-primary"  v-on:click="validForm">Save changes</button>-->
          </div>
        </form>
      </div>
    </div>
  </div>
  <div class="container-fluid">
    <div class="row">
      <col-item v-for='col in cols' :col='col' :key="col.id" @navigate="navigate"></col-item>
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

  export default {
    name: 'App',
    components: {
      ColItem
    },
    data(){
      return{
        cols:[],
        fileData:[],
        currentLanguage:{}
      }
    },
    methods: {
      ///event
      /*navigate(event){
        this.statusClick.col = event.col;
        if(event.source === 'keytrad') this.statusClick.button = event;
        if(!this.statusClick.button) this.navigate();
        if(event.source === 'nav') this.statusClick = {col:false,button:false};
      },*/
      ///
      /// INTERACTION
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
        for(var i=0; i<dataSplit.length; i++){
          let label = dataSplit[i];
          if(typeof items[label] !== 'undefined' &&  typeof items[label] !== 'string'){ items = items[label]; }
          else {
            if( i == dataSplit.length-1 ){
              items[label] = value;
            }else{
              items[label] = { };
              items = items[label];
            }
          }
        }
      },
      createCol(data,idCol){
        for(let i=0; i<this.cols.length; i++){
          this.cols[i].active = false;
        }
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
