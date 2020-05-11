$(function () {
  'use strict'

  let data = {}
  let currentCol = 0;



  const nav = document.createElement('nav');
  nav.className = 'col-md-2 d-none d-md-block sidebar';
  nav.innerHTML = `
    <div class="sidebar-sticky">
      <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
      </h6>
      <ul class="nav flex-column mb-2">
      </ul>
    </div>
  `;

  const li = document.createElement('li');
  li.className = 'nav-item';
  li.innerHTML = `
    <a class="nav-link" href="#"></a>
  `;

  let selectDropDown = document.getElementsByClassName("dropdown-menu")[0];
  let firstLanguage = selectDropDown.firstElementChild.getAttribute('data-url')
  getData(firstLanguage);
  

  document.onclick = function(e) {
    const element = e.target;
    let isLink = $(element).hasClass('nav-link');
    let isDiv = $(element).hasClass('sidebar-sticky');
    let isH = $(element).hasClass('sidebar-heading');
    
    let isNavShadowing = false;
    let searchNavEl = element.parentNode.parentNode; 
    if(isDiv) searchNavEl = element.parentNode;
    if(isH) searchNavEl = element.parentNode.parentNode;
    if(isLink) searchNavEl = element.parentNode.parentNode.parentNode.parentNode;

    isNavShadowing = $(searchNavEl).hasClass('smoother');
    
   
    if(isLink){
      var idSplit = element.id.split('-');
      var isBold = $(element).hasClass( "boldLabel");
      
      if(idSplit[0] !='labelFinalQueLonVeutCopier' && !isBold){
         goingToNextLevel(element);
      }else if(idSplit[0] =='labelFinalQueLonVeutCopier'){
        $('#'+element.id).tooltip('show');
        copyToClipboard(element.innerHTML);
        $('#'+element.id).attr('data-original-title', "Copied !").tooltip('show');
      }
    }else if(isNavShadowing){
      clearBoard(searchNavEl.id);
      $(searchNavEl).removeClass('smoother');
    }
    feather.replace();
  };
  
  /*¨document.getElementById('outer-container').onclick = function(e) {

  }*/

  $(document).on('click', '.dropdown-menu .dropdown-item',function () {
      let btnLabel = this.parentNode.parentNode.firstElementChild;
      btnLabel.innerHTML = this.innerHTML;
      console.log(this.innerHTML);
      console.log(btnLabel);

      let previousSelected = document.getElementsByClassName("active");
      let previousSelectedID = []; 

      for(let i=0; i<previousSelected.length; i++){
        previousSelectedID[i] = previousSelected[i].id;
      }

      ClearAllDescendentCol(-1);
      getData(this.getAttribute('data-url'),function(){
        for(let i=0; i<previousSelectedID.length; i++){
          let currElement = document.getElementById(previousSelectedID[i]);
          goingToNextLevel(currElement);
        }
      });
  });



  function goingToNextLevel(that){
    let parentElement = that.parentNode.parentNode;
    let idCol = parentElement.parentNode.parentNode.id;
    let nbCol = idCol.split('-')[1];

    clearBoard(idCol);

    // set active current 
    $(that).addClass("active");
    $(that).addClass("current");

    //create nextCol
    let nextCol = (parseInt(nbCol)+1);

    let currentData = searchLevel();
    createNav(currentData, 'col-'+nextCol+'');
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="tooltip"]').tooltip('hide');
  }

  function copyToClipboard(str){
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


  function searchLevel(){
    let activeEl = document.getElementsByClassName('active');
    const nbEl = activeEl.length;
    let currentData = JSON.parse(JSON.stringify(data));
    for(var i=0; i<nbEl; i++){
      currentData = currentData[activeEl[i].id];
    }
    return currentData;
  }

  function clearBoard(idCol){
     let nbCol = idCol.split('-')[1];
     ClearAllDescendentCol(nbCol);

     let curCol = document.getElementById(idCol);
     // remove active
     const childrensActive = curCol.getElementsByClassName('active');
     for(var i=0; i<childrensActive.length; i++){
      childrensActive[i].classList.remove('active');
     } 

     const childrensCurrent = document.getElementsByClassName('current');
     for(var i=0; i<childrensCurrent.length; i++){
      childrensCurrent[i].classList.remove('current');
     }

  }

  function ClearAllDescendentCol(nbCol){
    let childrensCol = document.getElementsByClassName('sidebar');
    nbCol = parseInt(nbCol);
    const nbMax = childrensCol.length;
    for(var i = nbCol+1; i<nbMax; i++){
      removeEl('col-'+i);
    }
    for(var i=0; i<nbCol+1;i++){
      let el = document.getElementById('col-'+i);
      el.classList.add('smoother');
    }
  }

    /*
  ###########
  GET DATA
  ###########
  */
  function getData(selectedFileUrl,successFunction){
    $.ajax({
          type: "get",
          url: "action.php",
          data : 'selectedFileUrl=' + selectedFileUrl,
          success : function(jsonFile){
            createList(jsonFile);
            if(successFunction != undefined) successFunction();
          },
          complete:function(jqXHR, textStatus) {
            //console.log("request complete "+textStatus);
          },
          error: function(xhr, textStatus, errorThrown){
            console.log('request failed->'+textStatus);
          }
        });
  }
  
  function clearDiv(id){
    let myNode = document.getElementById(id);
    while (myNode.firstChild) {
      myNode.removeChild(myNode.firstChild);
    }
  }
 function removeEl(id){
    let myNode = document.getElementById(id);
    myNode.parentNode.removeChild(myNode);  
  }

  function createList(jsonData){
    let disorganiseData = JSON.parse(jsonData);
    //var reorganiseData = {"result":{"result1":{},"result2":{},"result3":{}},"solution":"sol","ascension":"asc"};
    data = {};
    for (var value in disorganiseData){
      if (Array.isArray(data[value]) || typeof disorganiseData[value] === 'object') {}
      else{
        let dataSplit = value.split('.');
        createStructure(dataSplit,data,disorganiseData[value]);
      }
    }
    createNav(data,'col-'+currentCol+'');
    feather.replace();

    /*let name = data.split(',');
    for(var i=0; i<name.length-1; i++){
      let card = createDiv({"class":"card mb-4 box-shadow"});
      let cardBody = createDiv({"class":"card-body"});
      let label = createH4({"class":"my-0 font-weight-normal","content":name[i]});
      cardBody.append(label)
      card.append(cardBody);
      $("#cardData").append(card);
    }*/
  }
  function createStructure(dataSplit,currentData,value){
    let selector = currentData;
    for(var i=0; i<dataSplit.length; i++){
      let label = dataSplit[i];
      //let testAlreadyExist = exist(label,selector);
      if(selector[label] != undefined) {
        selector = selector[label];
      }
      else {
        if(i==dataSplit.length-1){
          selector[label] = {labelFinalQueLonVeutCopier:''+value+''};
        }else{
          selector[label]={};
          selector=selector[label];
        }
      }
    }
    return currentData;
  }

  function createNav(data,idNav){
    let currentNav = nav.cloneNode(true);
    currentNav.id = idNav;
    var countLabelFinal = 0;
    let searchNav = document.getElementById(''+idNav+'');
    let row = document.getElementsByClassName('row')[0];
    if(searchNav==null){
      row.appendChild(currentNav);
      $("#"+idNav+" h6").append("<span>"+idNav+"</span>");
    }
    let finalLabel = data.labelFinalQueLonVeutCopier;
    if(finalLabel != undefined){
      /*currentNav.classList.add('bg-light');
      createLi(idNav,'labelFinalQueLonVeutCopier',finalLabel);
      let currEl = document.getElementById('labelFinalQueLonVeutCopier');
      currEl.classList.add('finalLabel');
      currEl.setAttribute('data-toggle','tooltip');
      currEl.setAttribute('data-placement','bottom');
      currEl.setAttribute('title','Click to copy');*/
    }else{
      currentNav.classList.add('bg-light');
      let elementToEnd = [];
      for(var value in data){
        let finalLabel = data[value].labelFinalQueLonVeutCopier;
        if(finalLabel != undefined){
          elementToEnd[countLabelFinal] = []
          elementToEnd[countLabelFinal][0] = {"idNav": idNav, "idEl": value,"value": value, "position":false };
          let idEl = 'labelFinalQueLonVeutCopier-'+idNav+'-'+countLabelFinal;
          elementToEnd[countLabelFinal][1] = {"idNav": idNav, "idEl": idEl,"value": finalLabel, "position":false };
          countLabelFinal++;
        }else{
          createLi(idNav,value,value,true);
        }
      }

      for(let i=0; i<elementToEnd.length; i++){
        let currPrecElData = elementToEnd[i][0];
        let currElData = elementToEnd[i][1];

        let currPrecEl = createLi(currPrecElData.idNav,currPrecElData.idEl,currPrecElData.value,currPrecElData.position);
        currPrecEl.classList.add('boldLabel');

        let currEl = createLi(currElData.idNav,currElData.idEl,currElData.value,currElData.position);
        currEl.classList.add('finalLabel');
        currEl.setAttribute('data-toggle','tooltip');
        currEl.setAttribute('data-placement','top');
        currEl.setAttribute('title','Click to copy');
      }

    }
    
  }
  function createLi(idN,id,val,position){
    let currentLi = li.cloneNode(true);
    let baliseA = currentLi.getElementsByTagName('A')[0];
    baliseA.appendChild(document.createTextNode(val));
    baliseA.id = id;
    if(position){
      const span = document.createElement('span');
      span.setAttribute('data-feather', "chevron-right");
      baliseA.appendChild(span);
      $("#"+idN+" div ul").append(currentLi);
    }else{
      $("#"+idN+" div ul").append(currentLi);      
    }
    return baliseA;
  }

  function createEl(args){
    let el = document.createElement( args.type );
    if(args.class!=null) el.classList.add(args.class);
    if(args.content!=null)el.appendChild(document.createTextNode(args.content));
    if(args.dataFeather != null) el.setAttribute('data-feather', args.dataFeather);
    if(args.href != null)el.href=args.href;
    if(args.id!=null)el.id= args.id;
    return el;
  }

  function createH4(args){
    let h4 = document.createElement("h4");
    let content = document.createTextNode(args.content);
    $(h4).addClass(args.class);
    h4.appendChild(content);
    return h4;
  }
})