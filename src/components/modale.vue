<template>
	<b-modal id="bvModal" title="Add traduction key" hide-footer>
		<form class="needs-validation" novalidate>
			<div class="modal-body">
				<div class="form-group">
					<label for="Inputlabel">Label</label>
					<input type="texte" class="form-control" aria-describedby="labelHelp" required v-model="translateitem.label">
					<small id="labelHelp" class="form-text text-muted">You can use "/" to add colonne</small>
					<div class="invalid-feedback" id="labelInvalid">
						The label is missing 
					</div>
				</div>
				<div class="form-group">
					<label for="InputContent">Content</label>
					<input type="texte" class="form-control" v-model="translateitem.value">
					<div class="invalid-feedback" id="contentInvalid">
						The content is missing
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
				<button type="button" class="btn btn-primary"  v-on:click="validModal">Save changes</button>
			</div>
		</form>
	</b-modal>
</template>

<script>
	export default{
		props:{
			translateitem:Object,
			idModale:String
		},
		methods:{
			validModal(){
				
			}
		}
	}
</script>