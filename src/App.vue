<template>
  <div id="app">
    <Modale />
    <TableauData cols = cols/>
    <SelectLanguage currentLanguage=app.currentLanguage.name fileData=fileData/>
  </div>
</template>

<script>
import SelectLanguage from './components/SelectLanguage/SelectLanguage.vue'
import Modale from './components/modale.vue'
import TableauData from './components/TableauData/TableauData.vue'

export default {
  name: 'App',
  components: {
    SelectLanguage, TableauData, Modale
  },
  data() {
    return {
      currentTranslateitems: {},
      cols:[],
      statusClick:{ col:false , button:false },
      fileData : [],
      emoji :[
        {name:'fr-FR',emoji:'🇫🇷'},
        {name:'es-ES',emoji:'🇪🇸'},
        {name:'nl-BE',emoji:'🇳🇱'},
        {name:'it-IT',emoji:'🇮🇹'},
        {name:'pt-PT',emoji:'🇵🇹'}
      ],
      currentLanguage : {},
      folderUrl: "./data/",
    }  
  },
  methods: {
    //Form Interaction
    updateDataFile(label,content){
      let data = this.cleanData(label, content);
      let dataSet = this.fileData[this.currentLanguage.id].dataSet;
      dataSet[data.label] = data.content;
      this.fileData[this.currentLanguage.id].dataSetOrganise = app.organiseDataStructure(dataSet);
      this.currentLanguage = this.fileData[this.currentLanguage.id];

      window.jQuery('#addItemModal').modal('hide');
      this.updateNavContent();
      this.updateFile();
    },
    cleanData(label,content){
      let labelSplit = label.split('/');
      let labelSplitClean = [];
      for(let i=0; i<labelSplit.length; i++){
        if(labelSplit[i] != ''){
          labelSplitClean.push(labelSplit[i]); 
        }
      }
      label = '';
      for(let i=0; i<labelSplitClean.length; i++){
        label += labelSplitClean[i];
        if(i!=labelSplitClean.length-1){
          label += '.';
        }
      }
      return {label:label,content:content};
    },
    resetStatusInput(){
      window.jQuery('#Inputlabel').removeClass('is-valid');
      window.jQuery('#Inputlabel').removeClass('is-invalid');
      window.jQuery('#InputContent').removeClass('is-valid');
      window.jQuery('#InputContent').removeClass('is-invalid');
    },
    testIfAlreadyExist(label){
      var labelSplit = label.split('/');
      var cleanLabelSplit = [];
      
      for(let i=0; i<labelSplit.length; i++){
        if(labelSplit[i] != ''){
          cleanLabelSplit.push(labelSplit[i]);
        }
      }
      // Verifier dans tous les chemins
      if(cleanLabelSplit.length<=this.cols.length-1){
        for(var i=0; i<this.cols.length-1; i++){
          if(cleanLabelSplit[i] != undefined ){
            if(this.cols[i].selected.label != cleanLabelSplit[i]){
              console.log(this.cols[i].selected.label,cleanLabelSplit[i]);
              return false;
            } }
        }
      }else{
        return false;
      }
      return true;
    },
    // Interaction
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
    },
    navigate(){
      let colID = this.statusClick.col;
      let id = this.statusClick.button ? this.statusClick.button.id : false;
      let label = this.statusClick.button ? this.statusClick.button.label : false;

      this.resetCurrentStatuts();
      // remove all colonne after
      this.cols.splice(colID+1,this.cols.length-(colID+1));
      
      // set selected cols
      this.cols[colID].selected = {"id":id, "label":label};
      this.setLabelStatus(colID,id);

      // create new nav
      if(typeof id === 'number'){
        let data = this.cloneData(this.getDataSet());
        this.createCol(data);
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
    resetStatusClick(){
      this.statusClick = {col:false,button:false}
    },
    cloneData(data){
      return Object.assign({}, data, {})
    },
    getDataSet(){
      let data = this.cloneData(this.fileData[this.currentLanguage.id].dataSetOrganise);
      for(var i=0; i<this.cols.length; i++){
        data = data[ this.cols[i].selected.label ];
      }
      return data;
    },
    resetCurrentStatuts(){
      for(var i=0; i<this.cols.length; i++){
        let idSelected = this.cols[i].selected ? this.cols[i].selected.id : false;
        typeof idSelected === 'number' ? this.cols[i].value[idSelected].current = false : false;
      }
    },
    setLabelStatus(colID,id){
      let nbColValues = this.cols[colID].value.length;
      for(var i=0; i<nbColValues; i++){
        this.cols[colID].value[i].active = typeof id === 'number' && i == id  ? true : false;
      }
    },
    updateNavContent:function(){
      let dataSet = this.cloneData(this.fileData[this.currentLanguage.id].dataSetOrganise);
      let isEnd = false;
      for(let i=0; i<this.cols.length; i++){
        // utiliser le getDataSet
        if(!isEnd) this.createCol(dataSet,i);
        isEnd = true;

        if(this.cols[i].selected != undefined) {
          isEnd = false;
          let colSelectID = this.cols[i].selected;
          let colSelectValue = this.cols[i].value[colSelectID.id];
          if(colSelectValue != undefined){
            if(colSelectValue.label === colSelectID.label){
              // reactiver les selected
              this.cols[i].value[colSelectID.id].active = true;
              if(i == this.cols.length-2 ) this.cols[i].value[colSelectID.id].current = true;
              let searchData = dataSet[colSelectID.label];
              searchData != undefined ? dataSet = searchData : isEnd = true;
            }else{
              this.cols.splice(i+1,this.cols.length-(i+1));
              this.cols[i].selected = undefined;
              this.cols[i].active = true;
            }
          }else{
            this.cols.splice(i+1,this.cols.length-(i+1));
            this.cols[i].selected = undefined;
            this.cols[i].active = true;
          }
        }
      }
    },
    createCol:function(data,idCol){
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
        window.feather.replace();
        window.jQuery('[data-toggle="tooltip"]').tooltip();
      })
    },
    getDataCol:function(data){
      let itemsCol = [];
      let endItems = [];
      let item = '';
      let count = 0;
      for(var label in data){
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

    /// Organise data
    organiseDataStructure: function(jsonData){
      let data = {};
      for (var value in jsonData){
        if (!Array.isArray(jsonData[value]) || typeof jsonData[value] !== 'object') {
          let dataSplit = value.split('.');
          this.setItem(data, dataSplit, jsonData[value]);
        }  
      }
      return data;
    },
    setItem: function(data, dataSplit,value){
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
    initApp:function(){
      this.currentTranslateitems = this.fileData[0].dataSetOrganise;
      this.currentLanguage = this.fileData[0];
      this.createCol(this.cloneData(this.currentTranslateitems));
    }
  },
  created(){
    getData(this,this.folderUrl,getFile,{_that:this,id:0});
    
    // function to fetch file
    function getFile(args){
      let count = args.id;
      let _that = args._that;
      if(_that.fileData[count].extension === 'json'){
        fetchJsonFile(count,_that);
      }

      if(_that.fileData[count].extension === 'xlf'){
        fetchXLFfile(count,_that);
      }
    }
    
    function fetchXLFfile(count,_that){
      fetch(_that.folderUrl+_that.fileData[count].url)
      .then(response => response.text())
      .then(file => {
        let dataSource = labelInOut('<source>','</source>',file);
        let dataTarget = labelInOut('<target>','</target>',file);
        let json = {};

        for(let i=0; i<dataSource.length; i++){
          json[dataSource[i]]=dataTarget[i];
        }
        //app.organiseDataStructure(_that.fileData[count].id,json);
        _that.fileData[_that.fileData[count].id].dataSetOrganise = app.organiseDataStructure(json);
        _that.fileData[_that.fileData[count].id].dataSet = json;
        count++;
        count < _that.fileData.length ? getFile({_that:_that,id:count}) : _that.initApp();
      })
    }

    function labelInOut(texteIn, texteOut,fullTexte){
      var positionIn = searchInFile(fullTexte,texteIn,texteIn.length);
      var positionOut = searchInFile(fullTexte,texteOut,0);
      var indexPositionList = [];
      let substring = '';
      for(let i=0; i<positionIn.length; i++){
        substring = fullTexte.substring(positionIn[i],positionOut[i]);
        indexPositionList.push(substring);
      }
      return indexPositionList;
    }

    function searchInFile(fullTexte,label,delta){
      let indexOf = 0;
      let indexPositionList = [];
       while(indexOf != -1){
          indexOf = fullTexte.indexOf(label,indexOf+label.length);
          if(indexOf !=-1 ) indexPositionList.push(indexOf+delta);
       }
       return indexPositionList;
    }

    function fetchJsonFile(count,_that){
      fetch(_that.folderUrl+_that.fileData[count].url)
        .then(response => response.json())
        .then(json => {
          //app.organiseDataStructure(_that.fileData[count].id,json);
          _that.fileData[_that.fileData[count].id].dataSetOrganise = app.organiseDataStructure(json);
          _that.fileData[_that.fileData[count].id].dataSet = json;
          count++;
          count < _that.fileData.length ? getFile({_that:_that,id:count}) : _that.initApp();
        })
    }

    function getData(_that, folderUrl, successFunction, argSuccess){
      window.jQuery.ajax({
          type: "get",
          url: "dir.php",
          data :'folderUrl=' + folderUrl,
          success : function(jsonFile){
            let fileData = JSON.parse(jsonFile);
            stockDataFile(fileData);
            if(successFunction != undefined) successFunction(argSuccess);
          },
          complete:function(jqXHR, textStatus) {
            //console.log("request complete "+textStatus);
          },
          error: function(xhr, textStatus, errorThrown){
            console.log('request failed->'+errorThrown);
          }
        });
    }
    function stockDataFile(file){
      for(let i=0; i<file.length; i++){
        let splitFile = file[i].split('.');
        let name = createName(app,splitFile);
        let extension = splitFile[splitFile.length-1];
        app.fileData.push({ id:i, url:file[i], name:name, extension:extension, dataSet:{}});
      }

      function createName(app,splitFile){
        let name = '';
        let foundEmoji = '';
        for(let i=0; i<splitFile.length-1; i++){
          if(i>0) name += '.'
          name += splitFile[i];
          foundEmoji = getEmoji(app,splitFile[i]);
          name = foundEmoji+' '+name;
        }
        return name;
      }

      function getEmoji(app,txt){
          let emo = '';
          let splitTiretBas = txt.split('_');
          if(splitTiretBas.length == 2){
            txt = splitTiretBas[0]+"-"+splitTiretBas[1]
          }
          for(let i=0; i<app.emoji.length; i++){
            if(txt === app.emoji[i].name){
              emo += app.emoji[i].emoji;
            }
          }
          return emo;
        }
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
