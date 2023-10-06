<template>
    <CCard class="mt-2">
        <CCardBody>
            <CCardTitle>Quick Prompts</CCardTitle>
            <CCardText>Add quick prompts to provide quick responses.</CCardText>
			<CRow>
				<CCol md="7">
					<template v-for="(prompt,key) in inputs.prompts" :key="`propmpt_${key}`">
						<CCard class="mb-2">
							<CCardBody>
								<CCardSubtitle><CBadge color="primary">{{ prompt.title }}</CBadge></CCardSubtitle>
								<CCardTitle class="my-2 text-muted">{{ prompt.description }}</CCardTitle>						
							</CCardBody>
						</CCard>						
					</template>
				</CCol>
				<CCol md="5">
					<CCard>
						<CCardBody>
							<h6>Add Quick Prompt</h6>
							<CForm class="py-3" @submit.prevent="submit">
								<CCol class="py-2">
									<CFormLabel for="title" class="my-0">Title</CFormLabel>
									<CFormInput id="title" placeholder="eg. Test Bot" v-model="data.form.title"/>
									<CFormText component="span" id="title" class="">
										<p class="text-danger mb-0" v-show="has(data.errors,'title')">{{data.errors.title}}</p>								
										<p class="mb-0" v-show="!has(data.errors,'title')">The title of the prompt</p>	                    
									</CFormText>
								</CCol>
								<CCol class="py-2">
									<CFormLabel for="description" class="my-0">Prompt</CFormLabel>
									<CFormInput id="description" placeholder="eg. Hello there !" v-model="data.form.description"/>
									<CFormText component="span" id="description">
										<p class="text-danger mb-0" v-show="has(data.errors,'description')">{{data.errors.description}}</p>								
										<p class="mb-0" v-show="!has(data.errors,'description')">Information to be fetched</p>	                    
									</CFormText>
								</CCol>					
								<CCol class="py-0">
									<CButton color="primary" type="submit" :disabled="data.isDisabled || store.getters.loader">
										<CSpinner v-show="store.getters.loader" component="span" size="sm" aria-hidden="true"/>
										Add
									</CButton>
								</CCol>                                                                                                                        
							</CForm>	
						</CCardBody>
					</CCard>				
				</CCol>
			</CRow>
        </CCardBody>
    </CCard>     
</template>
<script setup>
import { computed, defineEmits, defineProps, inject, reactive, watch  } from 'vue';
import { cloneDeep, each, isEmpty, has, set } from 'lodash';
import * as yup from "yup"
import { useStore } from 'vuex';
import { useToast } from "vue-toastification";

const store = useStore();
const $api  = inject('$api');
const toast = useToast();
const swal  = inject('$swal');

const validateForm = (field) => {
	formSchema.validateAt(field, data.form)
        .then((value,key) => {
			delete data.errors[field];
		})
        .catch((err) => {
          data.errors[err.path] = err.message;
        });
}

const data   = reactive({
	errors:     {},
	form: {
		title: 		 String(),
		description: String()
	},
	isDisabled: true
});

const props = defineProps({
    form:{
        default: Object(),
        type:    Object,
    },
    tabs: {
        default: Object(),
        type: Object
    }
});

const formSchema = yup.object().shape({
	title:              yup.string()						
						  .required("*Title is required"),
    description:   yup.string()
						  .required("*Description message is required"),                        
});

const inputs = computed({
    get: () => props.form,
    set: (form) => {
        emits('updateForm',form);
    } 
});

const submit = () => {
	store.commit('loader',true);
	$api.post(`/ai/app/${inputs.value.app_id}/create/prompt`,data.form)
		.then( ({ data:{ prompt } }) => {
			resetForm();
			let appForm = cloneDeep(inputs.value);
			swal.fire({
                icon: 'success',
                title: 'Alright!',
                text: 'App prompt has been added.'
            }).then( () => {
				appForm.prompts.push(prompt);
            	emits('updateForm',appForm);
				toast.info(`You now have ${inputs.value.prompts.length} in this app.`);
			});
		})
		.catch( (err) => {
            console.log(err);
			store.commit('loader',false);
            swal.fire({
                icon: 'error',
                title: 'Hmmmm!',
                text: 'Something went wrong.'
            });
		})
		.finally( () => {
			store.commit('loader',false);
		});
}


const resetForm = () => {
	data.form = {
		title: 		 String(),
		description: String()
	}
}

watch(
	() => data.form, 
	async (form) => {
		each(form,(value,key) => {
			validateForm(key);
		});
		data.isDisabled = !(await formSchema.isValid(form));
	},
	{ 
		deep: true,
		immediate: true 
	}
);

const emits = defineEmits(['updateForm']);


</script>