<template>
	<b-modal id="bvModal" title="Add traduction key" @shown="focusInput" hide-footer>
		<b-form v-if="show" @close="onClose" @submit="onSubmit">
			<b-form-group
			id="path-group" label="Path:" label-for="path" description="You can use '.' to add colonne"
			>
				<b-form-input ref="pathInput" v-model="modalecontent.path" :state="validPath" required placeholder="Enter path"></b-form-input>
				<b-form-invalid-feedback :state="validPath">
					The label is missing or there is a '.' to the end
				</b-form-invalid-feedback>
			</b-form-group>
			<b-form-group id="content-group" label="Content:" label-for="content">
				<b-form-textarea ref="contentInput" id="content" v-model="modalecontent.value" :state="validContent" required placeholder="Enter content"></b-form-textarea>
				<b-form-invalid-feedback :state="validContent">
					the content is missing or already exist
				</b-form-invalid-feedback>
			</b-form-group>
			<b-card class="mt-3" header="Result">
				<pre class="m-0">{{ result }}</pre>
			</b-card>
			<b-button-toolbar class="mt-3">
				<b-button type="close" @click="onClose" variant="light" class="mx-1 ml-auto">Close</b-button>
				<b-button type="submit" @click="onSubmit" variant="primary" class="mx-1">Submit</b-button>
			</b-button-toolbar>
		</b-form>
	</b-modal>
</template>

<script>
	export default{
		props:{
			modalecontent:Object,
			idModale:String
		},
		data(){
			return{
				show: true
			}
		},
		computed: {
			validContent(){
				return this.modalecontent?.value ? true : false
			},
			validPath(){
				if(this.modalecontent?.path){
					return this.modalecontent.path.substring(this.modalecontent.path.length - 1) == '.' ? false : true
				}else{ return false}
			},
			result(){
				if(!this.modalecontent.value && !this.modalecontent.path ){
					return 
				}
				return `${this.modalecontent?.path || "" }: "${this.modalecontent?.value || "" }"`
			}
		},
		methods:{
			onSubmit(event) {
				event.preventDefault()
				if(this.validContent && this.validPath){
					this.$bvModal.hide('bvModal')
					this.$emit('validModale',this.modalecontent)	
				}
			},
			onClose(event){
				event.preventDefault();
				this.$bvModal.hide('bvModal')
			},
			focusInput() {
				if(!this.validPath){this.$refs.pathInput.focus()}
				else{
					this.$refs.contentInput.focus()
				}

			}
		}
	}
</script>