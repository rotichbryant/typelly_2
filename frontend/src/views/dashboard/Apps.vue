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
                        <template v-if="!$isEmpty(apps.data)">
                            <CCol md="4" xs="12" class="mb-3" v-for="(app,key) in apps.data" :key="`app_${key}`">
                                <CCard>
                                    <CCardBody>
                                        <CRow>
                                            <CCol class="d-flex justify-content-end">
                                                <CDropdown variant="nav-item" alignment="start" class="d-flex align-items-center">
                                                    <CDropdownToggle color="secondary" :caret="false">
                                                        <CIcon name="cilOptions"/>
                                                    </CDropdownToggle>
                                                    <CDropdownMenu>
                                                        <CDropdownItem href="#" @click="viewApp(app)">
                                                            <CSpinner v-show="app.loading" component="span" size="sm" aria-hidden="true"/>
                                                            <CIcon v-show="!app.loading" name="cil-pencil"/>    
                                                            Edit                                                            
                                                        </CDropdownItem>
                                                        <CDropdownItem href="#" class="text-danger" @click="deleteApp(app)">
                                                            <CIcon name="cil-trash"/>
                                                            Delete
                                                        </CDropdownItem>
                                                    </CDropdownMenu>
                                                </CDropdown>                                                
                                            </CCol>
                                            <CCol class="col-12 text-center">
                                                <CAvatar color="primary" class="text-white" size="xl">{{ app.name[0] }}</CAvatar>
                                                <CCardTitle class="mt-2">{{ app.name }}</CCardTitle>
                                                <p>{{ $moment(app.created_at).format('Do MMMM YYYY') }}</p>
                                            </CCol>
                                        </CRow>
                                    
                                    </CCardBody>
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
import moment from 'moment';
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
        this.$moment  = moment;
    },
    data(){
        return {
            apps: Object(),
            app:  Object(),
            form:{
                api_key:           String(),
                content_type:      String(),
                files:             Array(),
                model:             String(),
                name:              String(),
                welcome_message:   String(),
                input_placeholder: String(),     
                prompts:           Array(),
                sitemap:           Array(),   
                website_url:       String()
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
        }
    },
    methods:{
        fetch(){
            this.loading.fetch = true;
            this.$api
                .get(`/ai/app`)
                .then( ({ data: { apps } }) => {
                    apps.data = apps.data.map( val => ({...val,loading:false}));
                    this.apps = cloneDeep(apps);
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
                    this.modals.create = false;
                })
                .catch( (err) => {
                    this.loading.add = false;
                    let message = 'Something went wrong.'

                    if( err.response ){
                        message = err.response.data.message;
                    }

                    this.$swal.fire({
                        icon: 'error',
                        title: 'Hmmmm!',
                        text: message
                    });
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
                website_url:       String()
            };
        },
        viewApp({id}){
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
        deleteApp({id,name}){
            this.$swal.fire({
                icon: 'warning',
                title: 'Are you sure ?',
                text: `You are about to delete ${name} chatbot. This process is irreversible.`,
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then( (result) => {
                if( result.isConfirmed ){
                    this.$api
                        .delete(`/ai/app/${id}/delete`)
                        .then( () => {
                            this.$swal.fire({
                                icon:  'success',
                                title: 'Alright!',
                                text:  `${name} chatbot has been deleted.`
                            })                            
                            this.fetch() 
                        })
                        .catch( () => {

                        })
                        .finally( () => {

                        })                    
                }
            });            
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