<template>
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
            <button type="button" class="btn btn-primary"  v-on:click="validForm">Save changes</button>
          </div>
        </form>
      </div>
    </div>
  </div>
<template>
  
<script>
  export default {
    name: 'Modale',
    props: {
    },
    data: {
      errorFormMessage: {
        label:{empty:"The label is missing", exist:"The URL is already exist, add label to new entry" },
        content:{empty: "The content is missing"}
      }
    },
    methods:{
      validForm(event){
        var form = event.target.parentNode.parentNode;
        
        // /!\ Réintégrer en tant qu'element vuejs dans MODALE/!\
        var label = document.getElementById('Inputlabel').value;
        var content = document.getElementById('InputContent').value;
        var labelInvalid = document.getElementById('labelInvalid');
        var contentInvalid = document.getElementById('contentInvalid');
        // FIN

        content = content.trim();
        label = label.trim();

        let isGoodContent = true;
        let isGoodLabel = true;

        // Verifier label
        if(label.length > 0){
            if(this.testIfAlreadyExist(label)){
              labelInvalid.textContent = this.errorFormMessage.label.exist;
              isGoodLabel = false;
            }
        }else{
          contentInvalid.textLabel = this.errorFormMessage.label.empty;
          isGoodLabel = false;
        }

        // Verifier label
        if(content.length == 0 ){
          isGoodContent = false;
        }

        app.resetStatusInput();
        this.changeFormStatus(isGoodLabel,'Inputlabel');
        this.changeFormStatus(isGoodContent,'InputContent');
        if(isGoodLabel && isGoodContent)this.updateDataFile(label,content);
      },
      changeFormStatus(isGood, element){
        let el = document.getElementById(''+element+'');
        if(isGood){
          el.classList.add("is-valid");
        }else{
          el.classList.add("is-invalid");
        }
      },
    }

  }
</script>

<style scoped>
</style>
