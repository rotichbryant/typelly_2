<template>
    <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
        <CRow class="justify-content-center">
            <CCol :md="8">
            <CCardGroup>
                <CCard class="p-4">
                <CCardBody>
                    <CForm @submit.prevent="login">
                    <h1>Forgot Password</h1>
                    <p class="text-medium-emphasis">Recover your account.</p>
                    <CInputGroup class="mb-3">
                        <CInputGroupText>
                            <CIcon icon="cil-user" />
                        </CInputGroupText>
                        <CFormInput
                            placeholder="Email"
                            v-model="data.form.email"
                        />
                    </CInputGroup>            
                    <CRow>
                        <CCol :xs="6">
                            <CButton color="primary" class="px-4" type="submit"> Reset </CButton>
                        </CCol>
                    </CRow>
                    </CForm>
                </CCardBody>
                </CCard>
                <CCard class="text-white bg-primary py-5" style="width: 44%">
                <CCardBody class="d-flex align-items-center justify-content-center">
                    <div>
                        <h3>Already have an account ?</h3>
                        <p>If you have an account, you can login.</p>
                        <CButton color="light" variant="outline" class="mt-3" @click="router.push({ name: 'Login'})">Login</CButton>
                    </div>
                </CCardBody>
                </CCard>
            </CCardGroup>
            </CCol>
        </CRow>
        </CContainer>
    </div>
    </template>
    
    <script setup>
    import { inject, reactive, ref, watch } from 'vue';
    import { each, isEmpty, has } from 'lodash';
    import { useRouter } from 'vue-router';
    import * as yup from "yup";
    import { useToast } from "vue-toastification";
    import { useStore } from 'vuex';
    
    const store  = useStore();
    const router = useRouter();
    const $api   = inject('$api');
    const toast  = useToast();
    
    const data   = reactive({
        errors: {},
        form: {
            email:            String(),
            password:         String(),
        },
        isDisabled: true
    });
    
    const formSchema = yup.object().shape({
        email:            yup.string()
                             .email("*Enter a valid email address")
                             .required("*Email address is required"),
        password:         yup.string()
                             .required("*Password is required"),
    });
    
    const validateForm = (field) => {
        formSchema.validateAt(field, data.form)
            .then((value,key) => {
                delete data.errors[field];
            })
            .catch((err) => {
              data.errors[err.path] = err.message;
            });
    }
    
    const login = () => {
        store.commit('loader',true);
        $api.post('/auth/login',data.form)
            .then( () => {
                toast.success("Alright! Registration successful. Please check your email to verify your account.");
                resetForm();
            })
            .catch( ({ response: { data } }) => {
                if( !isEmpty(data) && data.statusCode == 400 ){
                    data.message.forEach( (value) => {
                        toast.info(value);
                    });
                }
            })
            .finally( () => {
                store.commit('loader',false);
            });
    }
    
    const resetForm = () => {
        data.form = {
            email:            String(),
            password:         String(),
        };
    };
    
    watch(data.form, (form) => {
        each(form,(value,key) => {
            validateForm(key);
        });
        data.isDisabled = isEmpty(data.errors);
    });
    
    
    </script>
        