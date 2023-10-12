<template>
    <CModal alignment="center" size="xl" :visible="modal" @close="modal = false"  keyboard backdrop="static">
      <CModalHeader>
        <CModalTitle>Create App</CModalTitle>
      </CModalHeader>
      <CModalBody>
       <CRow>
          <CCol md="7">
              <CCardText>Define the application information. Setup the way you want it</CCardText>
              <CAccordion>
                  <CAccordionItem :item-key="1">
                      <CAccordionHeader> App Description</CAccordionHeader>
                      <CAccordionBody>
                          <CCol class="py-2">
                              <CFormLabel for="bot_name" class="my-0">Chatbot Name</CFormLabel>
                              <CFormInput id="bot_name" placeholder="eg. Test Bot" v-model="form.name"/>
                              <CFormText component="span" id="bot_name" class="">
                                <p class="text-danger mb-0" v-show="$has(errors,'name')">{{errors.name}}</p>								
                                <p class="mb-0" v-show="!$has(errors,'name')">Provide the name of the chatbot app</p>	                    
                              </CFormText>
                          </CCol>
                          <CCol class="py-2">
                              <CFormLabel for="welcome_message" class="my-0">Welcome Message</CFormLabel>
                              <CFormInput id="welcome_message" placeholder="eg. Hello there !" v-model="form.welcome_message"/>
                              <CFormText component="span" id="welcome_message">
                                <p class="text-danger mb-0" v-show="$has(errors,'welcome_message')">{{errors.welcome_message}}</p>								
                                <p class="mb-0" v-show="!$has(errors,'welcome_message')">Give a welcome message to be displayed. </p>	                    
                              </CFormText>
                          </CCol>
                          <CCol class="py-2">
                              <CFormLabel for="input_placeholder" class="my-0">Input placeholder text</CFormLabel>
                              <CFormInput id="input_placeholder" placeholder="eg. What would you like to know ?" v-model="form.input_placeholder"/>
                              <CFormText component="span" id="input_placeholder">
                                <p class="text-danger mb-0" v-show="$has(errors,'input_placeholder')">{{errors.input_placeholder}}</p>								
                                <p class="mb-0" v-show="!$has(errors,'input_placeholder')">What you would like the users to see before typing ther question </p>								
                              </CFormText>
                          </CCol>                           
                      </CAccordionBody>
                  </CAccordionItem>
                  <CAccordionItem :item-key="2">
                    <CAccordionHeader>Configurations</CAccordionHeader>
                    <CAccordionBody>
                        <CRow>
                            <CCol class="col-md-12">   
                                <CCol class="py-2">
                                    <CFormLabel for="api_key" class="my-0">API Key</CFormLabel>
                                    <CFormInput id="api_key" placeholder="eg. sk-*****************" v-model="form.api_key"/>
                                    <CFormText component="span" id="welcome_message">
                                        <p class="text-danger mb-0" v-show="$has(errors,'api_key')">{{errors.api_key}}</p>								
                                        <p class="mb-0" v-show="!$has(errors,'api_key')">Add you openai api key.</p>	                    
                                    </CFormText>
                                </CCol>                                                              
                            </CCol>
                            <CCol class="col-md-12">
                                <CCol class="py-2">
                                    <CFormLabel for="hash_key" class="my-0">Hash Key</CFormLabel>
                                    <CFormInput id="hash_key" placeholder="eg. HYdoe779jhytsmGTG" v-model="form.hash_key" disabled/>
                                    <CFormText component="span" id="hash_key">
                                        <p class="text-danger mb-0" v-show="$has(errors,'hash_key')">{{errors.hash_key}}</p>								
                                        <p class="mb-0" v-show="!$has(errors,'hash_key')">Automatically generated when you add the api key</p>	                    
                                    </CFormText>
                                </CCol>
                            </CCol>
                        </CRow>                     
                    </CAccordionBody>                    
                  </CAccordionItem>                  
                  <CAccordionItem :item-key="3">
                    <CAccordionHeader>Content</CAccordionHeader>
                    <CAccordionBody>
                        <CRow>
                            <CCol class="col-12 text-center p-2">
                                <p class="text-danger mb-0" v-show="$has(errors,'content_type')">{{errors.content_type}}</p>								
                                <p class="mb-0" v-show="!$has(errors,'content_type')">Select the content source type to be added.</p>	                                  
                            </CCol>
                            <CCol class="d-flex justify-content-center col-md-12">
                                <CButtonGroup role="group" aria-label="Basic checkbox toggle button group">
                                    <CFormCheck v-model="form.content_type" type="radio" :button="{color: 'primary', variant: 'outline'}" name="btnradio" id="btnradio1" autocomplete="off" label="Website"   value="website"/>
                                    <CFormCheck v-model="form.content_type" type="radio" :button="{color: 'primary', variant: 'outline'}" name="btnradio" id="btnradio2" autocomplete="off" label="Sitemap"   value="sitemap"/>
                                    <CFormCheck v-model="form.content_type" type="radio" :button="{color: 'primary', variant: 'outline'}" name="btnradio" id="btnradio3" autocomplete="off" label="Documents" value="document"/>
                                </CButtonGroup>                                   
                            </CCol>
                            <CCol class="col-md-12">
                                <template v-if="$isEmpty(form.content)">
                                    <CCallout color="danger">
                                        <h6>Select the content type first.</h6>
                                    </CCallout>   
                                </template>
                            </CCol>
                        </CRow>                     
                    </CAccordionBody>                    
                  </CAccordionItem>
                  <CAccordionItem :item-key="4">
                      <CAccordionHeader>Quick prompts</CAccordionHeader>
                      <CAccordionBody>
                          <template v-for="(prompt,key) in form.prompts" :key="`propmpt_${key}`">
                              <CCard class="mb-2">
                                  <CCardBody>
                                      <CCardSubtitle><CBadge color="primary">{{ prompt.title }}</CBadge></CCardSubtitle>
                                      <CCardTitle class="my-2 text-muted">{{ prompt.description }}</CCardTitle>						
                                  </CCardBody>
                              </CCard>						
                          </template>
                          <p class="text-danger mb-0" v-show="$has(errors,'prompts')">{{errors.prompts}}</p>								
                          <CCallout color="primary" v-show="$isEmpty(form.prompts)">
                            <h6>
                                Nothing found here.
                            </h6>
                          </CCallout>   
                          <CCollapse :visible="collapse.add">
                            <CCard class="mt-3">
                                <CCardHeader class="d-flex justify-content-between align-items-center">
                                    <h6>Add a new quick prompt</h6>
                                    <CButton color="primary" @click="collapse.add = !collapse.add"><CIcon name="cil-chevron-bottom"/></CButton>
                                </CCardHeader>                                
                                <CCardBody>
                                    <CCol class="py-2">
                                        <CFormLabel for="title" class="my-0">Title</CFormLabel>
                                        <CFormInput id="title" placeholder="eg. Test Bot" v-model="prompt.title"/>
                                        <CFormText component="span" id="title" class="">
                                            <p class="text-danger mb-0" v-show="$has(errors,'title')">{{errors.title}}</p>								
                                            <p class="mb-0" v-show="!$has(errors,'title')">The title of the prompt</p>	                    
                                        </CFormText>
                                    </CCol>
                                    <CCol class="py-2">
                                        <CFormLabel for="description" class="my-0">Prompt</CFormLabel>
                                        <CFormInput id="description" placeholder="eg. Hello there !" v-model="prompt.description"/>
                                        <CFormText component="span" id="description">
                                            <p class="text-danger mb-0" v-show="$has(errors,'description')">{{errors.description}}</p>								
                                            <p class="mb-0" v-show="!$has(errors,'description')">Information to be fetched</p>	                    
                                        </CFormText>
                                    </CCol>					
                                    <CCol class="py-0">
                                        <CButton color="primary" @click="addPrompt" :disabled="disabled.promptBtn">                                        
                                            Add
                                        </CButton>
                                    </CCol>    
                                </CCardBody>
                            </CCard>
                        </CCollapse>    
                        <CCol md="12" class="text-center mt-3">
                            <CButton @click="collapse.add = true" color="primary">Add Prompt</CButton>                     
                        </CCol>                      
                      </CAccordionBody>
                  </CAccordionItem>
                  </CAccordion>
          </CCol>
          <CCol md="5" class="d-flex align-items-center">
              <Chatbot :tools="form"/>            
          </CCol>
       </CRow>
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" @click="$emit('submitForm')" :disabled="disabled.createBtn || loading">
            <CSpinner v-show="loading" component="span" size="sm" aria-hidden="true"/>
            Save changes
        </CButton>
      </CModalFooter>
    </CModal>    
  </template>
  
<script>
  import Chatbot from '@/components/Chatbot.vue';
  import { cloneDeep, each, has, isEmpty } from 'lodash';
  import * as yup from 'yup';
  import { UniqueCharOTP } from 'unique-string-generator';
  export default {
    components:{
        Chatbot
    },
    computed:{
        form:{
            get(){
                return this.data
            },
            set() {
                this.$emit('updateForm',val);
            }
        },
        modal:{
            get() {
                return this.show;
            },
            set (val) {
                this.$emit('updateModal',val);
            }
        }
    },
    created(){
        this.$has          = has;
        this.$isEmpty      = isEmpty;

        this.validateForm = (field) => {
            this.formSchema.validateAt(field, this.form)
                .then((value,key) => {
                    delete this.errors[field];
                })
                .catch((err) => {
                    this.errors[err.path] = err.message;
                });
        }
        this.validatePrompt= (field) => {
            this.promptSchema.validateAt(field, this.prompt)
                .then((value,key) => {
                    delete this.errors[field];
                })
                .catch((err) => {
                    this.errors[err.path] = err.message;
                });
        }        

        this.promptSchema = yup.object().shape({
            title:              yup.string()						
                                .required("*Title is required"),
            description:   yup.string()
                                .required("*Description message is required"),                        
        });
        this.formSchema = yup.object().shape({
            api_key:         yup.string()						
                                .required("*Api Key is required"),                               
            hash_key:        yup.string()						
                                .required("*Hash Key is required"),
            content_type:   yup.string()						
                                .required("*Content type is required"),                                
            files:           yup.array()
                                .when("content_type", {
                                    is: "documents",
                                    then: yup.array()
                                             .min(1, '* The application requires at least one file content')
                                             .required("*Prompts is required"),              
                                }),        
            sitemap:         yup.array()
                                .when("content_type", {
                                    is: "sitemap",
                                    then: yup.array()
                                             .min(1, '* The application requires at least one sitemap content')
                                             .required("*Prompts is required"),              
                                }),                                                          
            welcome_message: yup.string()
                                .required("*Welcome message is required"),
            website:         yup.string()
                                .when("content_type", {
                                    is: "welcome",
                                    then: yup.string().required("*Website link is required")
                                }),                                
            input_placeholder: yup.string()
                                .required("*Input placeholder is required"),  
            prompts:           yup.array()
                                  .of(
                                    yup.object().shape({
                                        description: yup.string().max(255).required().label('Description'),
                                        title:       yup.string().max(255).required().label('Title')
                                    })
                                  )
                                  .min(1, '* The application requires at least one quick prompt')
                                  .required("*Prompts is required"),                                                         
        });
    },
    data(){
        return {
            collapse:{
                add: Boolean()
            },
            prompt:{
                description: String(),
                title:    String()
            },
            errors: {},
            disabled: {
                createBtn: Boolean(),
                promptBtn: Boolean()
            }
        }
    },
    methods:{
        addPrompt(){
            this.form.prompts.push(cloneDeep(this.prompt));
            this.prompt = {
                description: String(),
                title:       String()
            };
        }
    },
    name: "CreateApp",
    props: {
        data: {
            default: Object(),
            type:    Object
        },
        loading:{
            default: Boolean(),
            type:    Boolean    
        },
        show:{
            default: Boolean(),
            type:    Boolean    
        }
    },
    watch:{
        prompt:{
            async handler(prompt){
                let self = this;
                each(prompt,(value,key) => {
                    self.validatePrompt(key);
                });
                this.disabled.promptBtn = !(await this.promptSchema.isValid(this.prompt));
            },
            deep: true,
        },
        data:{
            async handler(form){
                const self = this;
                each(form,(value,key) => {
                    self.validateForm(key);
                });
                this.disabled.createBtn = !(await this.formSchema.isValid(this.form));
            },
            deep: true,
        },
        "data.api_key"(value){
            if( !isEmpty(value) ){
                this.form.hash_key = UniqueCharOTP(50);
            } else {
                this.form.hash_key = String();
            }
        },
        async show(value){
            if( value ){
                const self = this;
                each(this.form,(value,key) => {
                    self.validateForm(key);
                });
                each(this.prompt,(value,key) => {
                    self.validatePrompt(key);
                });
                this.disabled.promptBtn = !(await this.promptSchema.isValid(this.prompt));
                this.disabled.createBtn = !(await this.formSchema.isValid(this.form));                
            }
        }      
    }
  }
</script>