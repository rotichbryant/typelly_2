<template>
    <CCol class="p-5" md="12" xs="12">
        <CCard class="h-100 p-3">
            <CCardBody>
                <CContainer fluid class="p-3">
                    <CRow class="pb-4">
                        <CCol>
                            <h3>List of AI Apps</h3>
                            <p>Create a chatbot and it up in your own website.</p>
                        </CCol>
                        <CCol class="text-end">
                            <CButton color="primary" @click="modals.create = true"> Create App</CButton>
                        </CCol>
                    </CRow>
                    <CRow>
                        <template v-for="(app,key) in apps.data" :key="`app_${key}`">
                            <CCol md="3" xs="12" >
                                <CCard>
                                    <CCardBody>
                                        <CCardTitle>{{ app.name }}</CCardTitle>
                                        <CCardSubtitle class="mb-2 text-muted">Card subtitle</CCardSubtitle>
                                        <CCardText>{{ app.welcome_message }}</CCardText>
                                        <CCol class="d-flex justify-content-between">
                                            <CButton color="secondary" variant="outline" class="text-primary" @click="viewApp(app.id)">
                                                <CSpinner v-show="loading.view" component="span" size="sm" aria-hidden="true"/>
                                                <CIcon v-show="!loading.view" name="cil-pencil"/>
                                            </CButton>
                                            <CButton color="secondary" variant="outline" class="text-danger" @click="deleteApp(app.id)">
                                                <CIcon name="cil-trash"/>
                                            </CButton>
                                        </CCol>
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
import { computed, inject, reactive } from 'vue';
import { cloneDeep, findIndex,isEmpty, merge } from 'lodash';
import { useStore } from 'vuex';
import { useToast } from "vue-toastification";
import { useRoute, useRouter } from 'vue-router';

export default {
    components:{
        CreateApp,
        EditApp
    },
    data(){
        return {
            apps: Object(),
            app:  Object(),
            form:{
                name:              String(),
                welcome_message:   String(),
                input_placeholder: String(),     
                prompts:           Array()           
            },
            loading:{
                add: Boolean(),
                view: Boolean()
            },
            modals:{
                create:  Boolean(),
                view: Boolean()
            }
        }
    },
    beforeRouteEnter(to, from, next) {
        next((vm) => {
            vm.fetch(), next();
        });
    },
    methods:{
        fetch(){
            this.$api
                .get(`/ai/app`)
                .then( ({ data: { apps } }) => {
                    apps.data = apps.data.map( val => ({...val,loading:false}));
                    this.apps = cloneDeep(apps);
                })
                .catch( () => {

                })
                .finally( () => {

                })
        },
        createApp(){
            this.loading.add = true;
            this.$api
                .post('/ai/app/create',this.form)
                .then( ({ data:{ app } }) => {
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
                    this.loading.add = false;
                    this.$swal.fire({
                        icon: 'error',
                        title: 'Hmmmm!',
                        text: 'Something went wrong.'
                    });
                })
                .finally( () => {
                    this.loading.add = false;
                });
        },
        fetchIndex(id){
            return findIndex(this.apps.data,(val) => val.id = id);
        },
        viewApp(id){
            this.apps.data[this.fetchIndex(id)].loading = true;
            this.$api
                .put(`/ai/app/${id}/show`)
                .then( ({ data: { app } }) => {
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
    setup(){
        // const store  = useStore();
        // const $api   = inject('$api');
        // const toast  = useToast();
        // const router = useRouter();
        // const swal   = inject('$swal');

        // const toggleModal = (value) => {
        //     data.modals.create = value;
        // }

        // const data = reactive({
        //     modals:{
        //         create: false,
        //     },
        //     columns: [
        //         { text: "Id",         value: "id" },
        //         { text: "Name",       value: "name" },
        //         { text: "Secret",     value: "secret" },
        //         { text: "Status",     value: "status" },
        //         { text: "Created On", value: "createdAt" },
        //     ],
        //     rows:[
        //         { id: "12345644", name:"Test App", secret: "aONJDBHFASJDSAJDI38748RD84H", status: "Active", createdAt: "12th Feb 2022"},
        //         { id: "12345644", name:"Test App", secret: "aONJDBHFASJDSAJDI38748RD84H", status: "Active", createdAt: "12th Feb 2022"},
        //         { id: "12345644", name:"Test App", secret: "aONJDBHFASJDSAJDI38748RD84H", status: "Active", createdAt: "12th Feb 2022"},
        //         { id: "12345644", name:"Test App", secret: "aONJDBHFASJDSAJDI38748RD84H", status: "Active", createdAt: "12th Feb 2022"},
        //         { id: "12345644", name:"Test App", secret: "aONJDBHFASJDSAJDI38748RD84H", status: "Active", createdAt: "12th Feb 2022"},
        //         { id: "12345644", name:"Test App", secret: "aONJDBHFASJDSAJDI38748RD84H", status: "Active", createdAt: "12th Feb 2022"},
        //         { id: "12345644", name:"Test App", secret: "aONJDBHFASJDSAJDI38748RD84H", status: "Active", createdAt: "12th Feb 2022"},
        //         { id: "12345644", name:"Test App", secret: "aONJDBHFASJDSAJDI38748RD84H", status: "Active", createdAt: "12th Feb 2022"},
        //         { id: "12345644", name:"Test App", secret: "aONJDBHFASJDSAJDI38748RD84H", status: "Active", createdAt: "12th Feb 2022"},
        //         { id: "12345644", name:"Test App", secret: "aONJDBHFASJDSAJDI38748RD84H", status: "Active", createdAt: "12th Feb 2022"},
        //         { id: "12345644", name:"Test App", secret: "aONJDBHFASJDSAJDI38748RD84H", status: "Active", createdAt: "12th Feb 2022"},
        //         { id: "12345644", name:"Test App", secret: "aONJDBHFASJDSAJDI38748RD84H", status: "Active", createdAt: "12th Feb 2022"},
        //         { id: "12345644", name:"Test App", secret: "aONJDBHFASJDSAJDI38748RD84H", status: "Active", createdAt: "12th Feb 2022"},
        //         { id: "12345644", name:"Test App", secret: "aONJDBHFASJDSAJDI38748RD84H", status: "Active", createdAt: "12th Feb 2022"},
        //         { id: "12345644", name:"Test App", secret: "aONJDBHFASJDSAJDI38748RD84H", status: "Active", createdAt: "12th Feb 2022"},
        //         { id: "12345644", name:"Test App", secret: "aONJDBHFASJDSAJDI38748RD84H", status: "Active", createdAt: "12th Feb 2022"},
        //         { id: "12345644", name:"Test App", secret: "aONJDBHFASJDSAJDI38748RD84H", status: "Active", createdAt: "12th Feb 2022"},
        //         { id: "12345644", name:"Test App", secret: "aONJDBHFASJDSAJDI38748RD84H", status: "Active", createdAt: "12th Feb 2022"},
        //         { id: "12345644", name:"Test App", secret: "aONJDBHFASJDSAJDI38748RD84H", status: "Active", createdAt: "12th Feb 2022"},
        //     ]
        // });
    }
}
</script>