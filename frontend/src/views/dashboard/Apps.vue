<template>
    <CCol class="p-3" md="12" xs="12">
        <CCard class="p-2">
            <CCardBody>
                <CContainer fluid class="p-3">
                    <CRow class="mb-3">
                        <CCol>
                            <h3>List of AI Apps</h3>
                            <p>Create a chatbot and it up in your own website.</p>
                        </CCol>
                        <CCol class="text-end">
                            <CButton color="primary" @click="modals.create = true"> Create App</CButton>
                        </CCol>
                    </CRow>
                    <CRow>
                        <template v-if="!$isEmpty(apps)">
                            <CCol md="3" xs="12" v-for="(app,key) in apps.data" :key="`app_${key}`">
                                <CCard>
                                    <CHeader class="justify-content-center">
                                        <CCardTitle class="m-0">{{ app.name }}</CCardTitle>
                                    </CHeader>
                                    <CCardBody>
                                        <CCardSubtitle class="mb-2 text-muted">Bot Instances: 3</CCardSubtitle>
                                        <CCardSubtitle class="mb-2 text-muted">Content Sources: 6 </CCardSubtitle>
                                        <CCardSubtitle class="mb-2 text-muted">Interactions: 50</CCardSubtitle>
                                    </CCardBody>
                                    <CFooter>
                                        <CCol class="d-flex justify-content-between">
                                            <CButton color="secondary" variant="outline" class="text-primary" @click="viewApp(app.id)">
                                                <CSpinner v-show="loading.view" component="span" size="sm" aria-hidden="true"/>
                                                <CIcon v-show="!loading.view" name="cil-pencil"/>
                                            </CButton>
                                            <CButton color="secondary" variant="outline" class="text-danger" @click="deleteApp(app.id)">
                                                <CIcon name="cil-trash"/>
                                            </CButton>
                                        </CCol>
                                    </CFooter>
                                </CCard>                    
                            </CCol>
                            <CCol md="12" xs="12" class="d-flex justify-content-center my-4">
                                <CButtonToolbar class="mb-3" role="group" aria-label="Toolbar with button groups">
                                    <CButtonGroup class="me-2" role="group" aria-label="First group">
                                        <CButton color="secondary" variant="outline">1</CButton>
                                        <CButton color="secondary" variant="outline">2</CButton>
                                        <CButton color="secondary" variant="outline">3</CButton>
                                        <CButton color="secondary" variant="outline">4</CButton>
                                    </CButtonGroup>
                                </CButtonToolbar>                                
                            </CCol>
                        </template>
                        <template v-else>
                            <CCol>
                                <CCard>
                                    <CCardBody class="p-5 d-flex align-items-center justify-content-center">
                                        <template v-if="loading.fetch"><h6><CSpinner size="sm"/></h6></template>
                                        <template v-else><h6><CIcon name="cil-bell"/> Nothing found here.</h6></template>
                                    </CCardBody>
                                </CCard>
                            </CCol>
                        </template>                
                    </CRow>
                </CContainer>
                <CreateApp 
                    :show="modals.create"
                    :data="form"
                    :loading="loading.add"
                    :models="models"
                    @submitForm="createApp"
                    @updateModal="updateModalAdd"
                />
                <EditApp 
                    :show="modals.view"
                    :data="app"
                    @updateModal="updateModalView"
                />
            </CCardBody>
        </CCard>
    </CCol>
</template>

<script>
import CreateApp from './show/CreateApp.vue';
import EditApp from './show/EditApp.vue';
import { cloneDeep, findIndex,isEmpty, upperFirst } from 'lodash';

export default {
    beforeRouteEnter(to, from, next) {
        next((vm) => {
            vm.fetch(), next();
        });
    },    
    components:{
        CreateApp,
        EditApp
    },
    created(){
        this.$isEmpty = isEmpty;
    },
    data(){
        return {
            apps: Object(),
            app:  Object(),
            form:{
                api_key:           String(),
                content_type:      String(),
                hash_key:          String(),
                files:             Array(),
                model:             String(),
                name:              String(),
                welcome_message:   String(),
                input_placeholder: String(),     
                prompts:           Array(),
                sitemap:           Array(),   
                website:           String()
            },
            loading:{
                add: Boolean(),
                fetch: Boolean(),
                view: Boolean()
            },
            modals:{
                create:  Boolean(),
                view: Boolean()
            },
            models: Array()
        }
    },
    methods:{
        fetch(){
            this.loading.fetch = true;
            this.$api
                .get(`/ai/app`)
                .then( ({ data: { apps, models } }) => {
                    apps.data   = apps.data.map( val => ({...val,loading:false}));
                    this.models = cloneDeep(models).map( (model) => ({ label: model.id.split('-').map( value => upperFirst(value)).join(' '), value: model.id }))
                    this.apps   = cloneDeep(apps);
                })
                .catch( () => {

                })
                .finally( () => {
                    this.loading.fetch = false;
                })
        },
        createApp(){
            this.loading.add = true;
            this.$api
                .post('/ai/app/create',this.form)
                .then( ({ data:{ app } }) => {
                    this.resetForm();
                    this.$swal.fire({
                        icon: 'success',
                        title: 'Alright!',
                        text: "Your chatbot app has been created."
                    }).then( () => {
                        this.modals.add = false;
                        this.fetch() 
                    });
                })
                .catch( (err) => {
                    console.log(err);
                    // this.loading.add = false;
                    this.$swal.fire({
                        icon: 'error',
                        title: 'Hmmmm!',
                        text: 'Something went wrong.'
                    });
                })
                .finally( () => {                    
                    this.modals.create = false;
                });
        },
        fetchIndex(id){
            return findIndex(this.apps.data,(val) => val.id = id);
        },
        resetForm(){
            this.form = {
                api_key:           String(),
                content_type:      String(),
                hash_key:          String(),
                files:             Array(),
                model:             String(),
                name:              String(),
                welcome_message:   String(),
                input_placeholder: String(),     
                prompts:           Array(),
                sitemap:           Array(),   
                website:           String()
            };
        },
        viewApp(id){
            this.apps.data[this.fetchIndex(id)].loading = true;
            this.$api
                .put(`/ai/app/${id}/show`)
                .then( ({ data: { app } }) => {
                    if( !isEmpty(this.app) ){ this.app = {}; }
                    this.app = cloneDeep(app);
                    this.modals.view = true;
                })
                .catch( () => {

                })
                .finally( () => {
                    this.apps.data[this.fetchIndex(id)].loading = false;
                })
        },
        deleteApp(id){
            this.$api
                .get(`/ai/app/${id}/delete`)
                .then( ({ data: { apps } }) => {
                    this.apps = cloneDeep(apps);
                })
                .catch( () => {

                })
                .finally( () => {

                })
        },
        updateModalAdd(value){
            this.modals.create = value;
        },
        updateModalView(value){
            this.modals.view = value;
        },
    },
    watch:{
        "modals.view"(val){
            if( val == false ){
                this.app = Object();
            }
        }
    }
}
</script>