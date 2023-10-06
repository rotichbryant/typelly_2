<template>
<div class="bg-light min-vh-100 d-flex flex-row align-items-center">
	<CContainer>
	<CRow class="justify-content-center">
		<CCol :md="8">
		<CCardGroup>
			<CCard class="p-4">
			<CCardBody>
				<CForm @submit.prevent="login">
				<h1>Login</h1>
				<p class="text-medium-emphasis">Sign In to your account</p>
				<CInputGroup class="mb-3">
					<CInputGroupText>
						<CIcon icon="cil-user" />
					</CInputGroupText>
					<CFormInput
						placeholder="Email"
						v-model="data.form.email"
					/>
					<p class="text-danger col col-12 mb-0" v-show="has(data.errors,'email')">{{data.errors.email}}</p>								
				</CInputGroup>
				<CInputGroup class="mb-4">
					<CInputGroupText>
						<CIcon icon="cil-lock-locked" />
					</CInputGroupText>
					<CFormInput
						type="password"
						placeholder="Password"
						v-model="data.form.password"
					/>
					<p class="text-danger col col-12 mb-0" v-show="has(data.errors,'password')">{{data.errors.password}}</p>								
				</CInputGroup>
				<CRow>
					<CCol :xs="6">
						<CButton color="primary" type="submit" :disabled="data.isDisabled || store.getters.loader">
							<CSpinner v-show="store.getters.loader" component="span" size="sm" aria-hidden="true"/>
							Login
						</CButton>
					</CCol>
					<CCol :xs="6" class="text-right">
						<CButton color="link" class="px-0" @click="router.push({ name: 'Forgot'})">
							Forgot password?
						</CButton>
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
					<CButton color="light" variant="outline" class="mt-3" @click="router.push({ name: 'Register'})">Register</CButton>
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
const swal = inject('$swal');

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
		.then( ({ data:{ user, token }}) => {
			store.commit('auth',{user, token});
			swal.fire({
				icon: 'success',
				title: 'Alright!',
				text: 'Login successfull.'
			}).then((result) => {
				window.location.reload();
			});	
		})
		.catch( ({ response }) => {
			store.commit('loader',false);
			if( !isEmpty(response.data) && response.data.statusCode == 400 ){
				response.data.message.forEach( (value) => {
					toast.info(value);
				});
			}
			if( response.status == 404 ){
				swal.fire({
					icon: 'error',
					title: 'Oops!',
					text: 'Sorry we could not your account. Register a new account.'
				});
			}
			if( response.status == 401 ){
				swal.fire({
					icon: 'error',
					title: 'Oops!',
					text: 'Your email or password is incorrect.',
				});
			}
		})
		.finally( () => {
			store.commit('loader',false);
		});
}

watch(
	() => data.form, 
	(form) => {
		each(form,(value,key) => {
			validateForm(key);
		});
		data.isDisabled = !isEmpty(data.errors);
	},
	{ 
		deep: true,
		immediate: true 
	}
);


</script>
	