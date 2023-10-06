<template>
	<div class="bg-light min-vh-100 d-flex flex-row align-items-center">
		<CContainer>
		<CRow class="justify-content-center">
			<CCol :md="8">
			<CCardGroup>
				<CCard class="p-4">
					<CCardBody>
						<CForm @submit.prevent="createAccount">
							<h2>Welcome on board.</h2>
							<p class="text-medium-emphasis">Fill in the form below to register</p>
							<CInputGroup class="mb-3">
								<CInputGroupText>
									<CIcon icon="cil-user" />
								</CInputGroupText>
								<CFormInput placeholder="First Name" autocomplete="firstname" v-model="data.form.first_name"/>
								<p class="text-danger col col-12 mb-0" v-show="has(data.errors,'first_name')">{{data.errors.first_name}}</p>								
							</CInputGroup>
							<CInputGroup class="mb-3">
								<CInputGroupText>
									<CIcon icon="cil-user" />
								</CInputGroupText>
								<CFormInput placeholder="Last Name" autocomplete="lastname" v-model="data.form.last_name"/>
								<p class="text-danger col col-12 mb-0" v-show="has(data.errors,'last_name')">{{data.errors.last_name}}</p>								
							</CInputGroup>						
							<CInputGroup class="mb-3">
								<CInputGroupText>@</CInputGroupText>
								<CFormInput placeholder="Email" autocomplete="email" v-model="data.form.email"/>
								<p class="text-danger col col-12 mb-0" v-show="has(data.errors,'email')">{{data.errors.email}}</p>								
							</CInputGroup>
							<CInputGroup class="mb-3">
								<CInputGroupText>
									<CIcon icon="cil-lock-locked" />
								</CInputGroupText>
								<CFormInput
									type="password"
									placeholder="Password"
									autocomplete="new-password"
									v-model="data.form.password"
								/>
								<p class="text-danger col col-12 mb-0" v-show="has(data.errors,'password')">{{data.errors.password}}</p>								
							</CInputGroup>
							<CInputGroup class="mb-4">
								<CInputGroupText>
									<CIcon icon="cil-lock-locked" />
								</CInputGroupText>
								<CFormInput
									type="password"
									placeholder="Repeat password"
									autocomplete="new-password"
									v-model="data.form.confirm_password"								
								/>
								<p class="text-danger col col-12 mb-0"  v-show="has(data.errors,'confirm_password')">{{data.errors.confirm_password}}</p>								
							</CInputGroup>
							<div class="d-grid">
								<CButton color="primary" type="submit" :disabled="data.isDisabled || store.getters.loader">
									<CSpinner v-show="store.getters.loader" component="span" size="sm" aria-hidden="true"/>
									Create Account
								</CButton>
							</div>
						</CForm>					
					</CCardBody>
				</CCard>
				<CCard class="text-white bg-primary py-5" style="width: 44%">
					<CCardBody class="d-flex align-items-center justify-content-center">
						<div>
							<h3>Already have an account ?</h3>
							<p>If you have an account, you can login.</p>
							<CButton color="light" variant="outline"  class="mt-3" @click="router.push({ name: 'Login'})">Login</CButton>
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
		first_name:       String(),
		last_name:        String(),
		email:            String(),
		password:         String(),
		confirm_password: String()		
	},
	isDisabled: true
});

const formSchema = yup.object().shape({
	first_name:       yup.string().required("*First name is required"),
	last_name:        yup.string().required("*Last name is required"),
	email:            yup.string()
						 .email("*Enter a valid email address")
						 .required("*Email address is required"),
	password:         yup.string().required("*Password is required"),
	confirm_password: yup.string()
						 .required("*Password confirmation is required")
						 .oneOf([yup.ref("password"), ''], "*Password must match")
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

const createAccount = () => {
	store.commit('loader',true);
	$api.post('/auth/signup',data.form)
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
		first_name:       String(),
		last_name:        String(),
		email:            String(),
		password:         String(),
		confirm_password: String()		
	};
};

watch(data.form, (form) => {
	each(form,(value,key) => {
		validateForm(key);
	});
	data.isDisabled = isEmpty(data.errors);
});


</script>