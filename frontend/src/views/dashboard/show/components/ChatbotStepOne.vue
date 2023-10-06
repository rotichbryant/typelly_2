<template>
    <CCard class="mt-2">
        <CCardBody>
            <CCardTitle>Chatbot Setup</CCardTitle>
            <CCardText>Describe the chatbot app you want to create</CCardText>
            <h6>Change the content of your chatbot app.</h6>
            <CForm class="py-3" @submit.prevent="submit">
                <CCol class="py-2">
                    <CFormLabel for="bot_name" class="my-0">Chatbot Name</CFormLabel>
                    <CFormInput id="bot_name" placeholder="eg. Test Bot" v-model="inputs.name"/>
                    <CFormText component="span" id="bot_name" class="">
                        <p class="text-danger mb-0" v-show="has(data.errors,'name')">{{data.errors.name}}</p>								
					    <p class="mb-0" v-show="!has(data.errors,'name')">Provide the name of the chatbot app</p>	                    
                    </CFormText>
                </CCol>
                <CCol class="py-2">
                    <CFormLabel for="welcome_message" class="my-0">Welcome Message</CFormLabel>
                    <CFormInput id="welcome_message" placeholder="eg. Hello there !" v-model="inputs.welcome_message"/>
                    <CFormText component="span" id="welcome_message">
                        <p class="text-danger mb-0" v-show="has(data.errors,'welcome_message')">{{data.errors.welcome_message}}</p>								
					    <p class="mb-0" v-show="!has(data.errors,'welcome_message')">Give a welcome message to be displayed. </p>	                    
                    </CFormText>
                </CCol>
                <CCol class="py-2">
                    <CFormLabel for="input_placeholder" class="my-0">Input placeholder text</CFormLabel>
                    <CFormInput id="input_placeholder" placeholder="eg. What would you like to know ?" v-model="inputs.input_placeholder"/>
                    <CFormText component="span" id="input_placeholder">
					    <p class="text-danger mb-0" v-show="has(data.errors,'input_placeholder')">{{data.errors.input_placeholder}}</p>								
					    <p class="mb-0" v-show="!has(data.errors,'input_placeholder')">What you would like the users to see before typing ther question </p>								
                    </CFormText>
                </CCol>
                <CCol class="py-0 d-flex justify-content-end">
                    <CButton color="primary" type="submit" :disabled="data.isDisabled || store.getters.loader">
                        <CSpinner v-show="store.getters.loader" component="span" size="sm" aria-hidden="true"/>
                        Next
                    </CButton>
                </CCol>                                                                                                                        
            </CForm>
        </CCardBody>
    </CCard>     
</template>
<script setup>
import { computed, defineEmits, defineProps, inject, reactive, watch  } from 'vue';
import { cloneDeep, each, isEmpty, has, set } from 'lodash';
import * as yup from "yup"
import { useStore } from 'vuex';
import { useToast } from "vue-toastification";

const validateForm = (field) => {
	formSchema.validateAt(field, props.form)
        .then((value,key) => {
			delete data.errors[field];
		})
        .catch((err) => {
          data.errors[err.path] = err.message;
        });
}

const data   = reactive({
	errors:     {},
	isDisabled: true
});

const store = useStore();
const $api  = inject('$api');
const toast = useToast();
const swal  = inject('$swal');

const props = defineProps({
    form:{
        default: Object(),
        type:    Object,
    },
    stepTwoForm:{
        default: Object(),
        type:    Object,
    },
    tabs: {
        default: Object(),
        type: Object
    }
});

const formSchema = yup.object().shape({
	name:              yup.string()						
						  .required("*Name is required"),
    welcome_message:   yup.string()
						  .required("*Welcome message is required"),
    input_placeholder: yup.string()
						  .required("*Input placeholder is required"),                         
});

const inputs = computed({
    get: () => props.form,
    set: (form) => {
        emits('updateForm',form);
    } 
});

const formTabs = computed({
    get: () => props.tabs,
    set: (tabs) => {
        emits('updateTabs',tabs);
    } 
});

const submit = () => {
	store.commit('loader',true);
	$api.post('/ai/app/create',inputs.value)
		.then( ({ data:{ app } }) => {
            swal.fire({
                icon: 'success',
                title: 'Alright!',
                text: "Your chatbot app has been created. Lets now add some quick prompts."
            }).then( () => {
                toast.info("Add a prompt for this chatbot application.");
                console.log(set(cloneDeep(props.stepTwoForm),'app_id',app.id))
                emits('updateTab',{ active: 2 });
                emits('updateStepTwoForm',set(cloneDeep(props.stepTwoForm),'app_id',app.id));
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


watch(
	() => props.form, 
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

const emits = defineEmits(['updateForm','updateTab']);


</script>