<template>
    <CCol md="12" class="p-4">
        <CRow class="h-95">
            <CCol md="8" class="d-flex">
                <CCard class="col-12">
                    <CCardBody class="p-4">
                        <h4>Create chatbot application</h4>
                        <p>Setup a new chatbot, quick prompts and start testing the application.</p>
                        <CCol class="px-0 m-4 position-relative">
                            <CProgress :height="1" class="mb-3">
                                <CProgressBar :value="data.tabs.active == 1 ? 0 : 100"></CProgressBar>
                            </CProgress>                                
                            <CButton type="button" color="primary" class="position-absolute top-0 start-0 translate-middle rounded-pill">1</CButton>
                            <CButton type="button" :color="data.tabs.active == 2 ? 'primary' : 'secondary'" class="position-absolute top-0 start-100 translate-middle rounded-pill">2</CButton>
                        </CCol>
                        <ChatbotStepOne 
                            v-show="data.tabs.active == 1"
                            :form="data.form.stepOne"
                            :stepTwoForm="data.form.stepTwo"
                            :tabs="data.tabs"
                            @updateForm="updateStepOneForm"
                            @updateStepTwoForm="updateStepTwoForm"
                            @updateTab="updateTabs"
                        />
                        <ChatbotStepTwo 
                            v-show="data.tabs.active == 2"
                            :form="data.form.stepTwo"
                            @updateForm="updateStepTwoForm"
                        />
                        <CCol md="12" class="d-flex justify-content-end mt-3" v-if="!isEmpty(data.form.stepTwo.app_id)">
                            <CButton color="primary" type="submit" @click="publish" :disabled="store.getters.loader">
                                <CSpinner v-show="store.getters.loader" component="span" size="sm" aria-hidden="true"/>
                                Publish
                            </CButton>
                        </CCol>                         
                    </CCardBody>
                </CCard>                      
            </CCol>
            <CCol md="4" class="d-flex">
                <Chatbot
                    :tools="chatbot"
                />
            </CCol>
        </CRow>
    </CCol>
</template>
<script setup>
import Chatbot from '@/components/Chatbot.vue'
import ChatbotStepOne from './components/ChatbotStepOne.vue';
import ChatbotStepTwo from './components/ChatbotStepTwo.vue';
import { computed, inject, reactive } from 'vue';
import { cloneDeep,isEmpty, merge } from 'lodash';
import { useStore } from 'vuex';
import { useToast } from "vue-toastification";
import { useRoute, useRouter } from 'vue-router';

const store  = useStore();
const $api   = inject('$api');
const toast  = useToast();
const router = useRouter();
const swal   = inject('$swal');

const chatbot = computed( () => merge( cloneDeep(data.form.stepOne), cloneDeep(data.form.stepTwo) ));

const data = reactive({
    form:{
        stepOne:{
            name:              String(),
            welcome_message:   String(),
            input_placeholder: String(),
        },
        stepTwo: {
            app_id:  String(),
            prompts: []
        }
    },
    tabs:{
        active: 1,
    },

});

const publish = () => {
	if( isEmpty(data.form.stepTwo.prompts) ){
		return toast.warning('You have to add atleast one quick prompt to this application.')
	}
	store.commit('loader',true);
	$api.post(`/ai/app/${data.form.stepTwo.app_id}/update`,{ publish: true })
		.then( ({ data:{ app } }) => {
			swal.fire({
                icon: 'success',
                title: 'Alright!',
                text: 'Your chatbot is now live.'
            }).then( () => {
				router.push({name:'ViewApp',params:{ app_id: app.id }});
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


const updateStepOneForm = (form) => {
    data.form.stepOne = cloneDeep(form);
}
const updateStepTwoForm = (form) => {
    data.form.stepTwo = cloneDeep(form);
}

const updateTabs = (value) => {
    data.tabs = value;
}
</script>