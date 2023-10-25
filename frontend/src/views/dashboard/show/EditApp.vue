<template>
    <CModal alignment="center" size="xl" :visible="modal" @close="modal = false" keyboard backdrop="static">
      <CModalHeader>
        <CModalTitle>Edit App </CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CCol md="12">
            <CFormSwitch label="Live Mode" v-model="live" />
          </CCol>        
       <CRow>
          <CCol md="7" :class="live ? 'opacity-50' : ''">
            <CCardText> Modify this application.  </CCardText>
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
                                    <p class="text-danger mb-0" v-show="$has(errors.form,'api_key')">{{errors.form.api_key}}</p>								
                                    <p class="mb-0" v-show="!$has(errors.form,'api_key')">Add you openai api key.</p>	                    
                                </CFormText>
                            </CCol>                                                              
                        </CCol>
                        <CCol class="col-md-12">
                            <CCol class="py-2">
                                <CFormLabel for="hash_key" class="my-0">Hash Key</CFormLabel>
                                <CFormInput id="hash_key" placeholder="eg. HYdoe779jhytsmGTG" v-model="form.hash_key" disabled/>
                                <CFormText component="span" id="hash_key">
                                    <p class="text-danger mb-0" v-show="$has(errors.form,'hash_key')">{{errors.form.hash_key}}</p>								
                                    <p class="mb-0" v-show="!$has(errors.form,'hash_key')">Automatically generated when you add the api key</p>	                    
                                </CFormText>
                            </CCol>
                        </CCol>
                        <CCol class="col-md-12">
                            <CCol class="py-2">
                                <CFormSelect
                                    label="Select Model"
                                    aria-label="Select model"
                                    :options="listModels"
                                    @update:modelValue="form.model = $event"
                                >
                                </CFormSelect>
                                <p class="text-danger mb-0" v-show="$has(errors.form,'model')">{{errors.form.model}}</p>								
                                <p class="mb-0" v-show="!$has(errors.form,'model')">Select openai model to use in this application.</p>	                                      
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
                            <p class="text-danger mb-0" v-show="$has(errors.form,'content_type')">{{errors.form.content_type}}</p>								
                            <p class="mb-0" v-show="!$has(errors.form,'content_type')">Select the content source type to be added.</p>	   
                                                            
                        </CCol>
                        <CCol class="d-flex justify-content-center col-md-12">
                            <CButtonGroup role="group" aria-label="Basic checkbox toggle button group">
                                <CFormCheck @change="changeContentType($event)" true-value="documents" type="radio" :button="{color: 'primary', variant: 'outline'}" name="content_type" id="btnradio3" autocomplete="off" label="Documents" value="documents"/>
                                <CFormCheck @change="changeContentType($event)" true-value="sitemap" type="radio" :button="{color: 'primary', variant: 'outline'}" name="content_type" id="btnradio2" autocomplete="off" label="Sitemap"   value="sitemap"/>
                                <CFormCheck @change="changeContentType($event)" true-value="website" type="radio" :button="{color: 'primary', variant: 'outline'}" name="content_type" id="btnradio1" autocomplete="off" label="Website"   value="website"/>
                            </CButtonGroup>                                   
                        </CCol>
                        <CCol class="col-md-12">
                            <template v-if="$isEmpty(form.content_type)">
                                <CCallout color="danger">
                                    <h6>Select the content type first.</h6>
                                </CCallout>   
                            </template>
                            <template v-else>
                                <CCard class="mt-3">
                                    <CCardBody>
                                        <CRow v-if="form.content_type == 'documents'">
                                            <CCol>
                                                <CFormInput accept=".doc,.docx,.pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document, .txt" type="file" id="formFileMultiple" label="File upload." multiple @change="uploadFiles($event)" />
                                                <p class="text-danger mb-0" v-show="$has(errors.form,'hash_key')">{{errors.form.files}}</p>								
                                                <p class="mb-0" v-show="!$has(errors.form,'files')">You can select multiple files</p>	                                                                        
                                            </CCol>
                                        </CRow>
                                        <CRow v-if="form.content_type  == 'sitemap'">
                                            <CCol class="col-12 ">
                                                <CInputGroup class="mb-3">
                                                    <CFormInput v-model="local.sitemap_url" placeholder="eg. http://example.com" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"/>
                                                    <CInputGroupText id="inputGroup-sizing-default">
                                                        <CSpinner v-show="loader.sitemap" size="sm"/>
                                                        <span v-show="!loader.sitemap">Website Url</span>
                                                    </CInputGroupText>
                                                </CInputGroup>                                                    
                                                <p class="text-danger mb-0" v-show="$has(errors.local,'sitemap_url')">{{errors.local.sitemap_url}}</p>								
                                                <p class="mb-0" v-show="!$has(errors.local,'sitemap_url')">You can select multiple files</p>
                                            </CCol>
                                            <CCol class="col-12 mt-4" v-show="!$isEmpty(local.sitemap_links)">
                                                <h6>Sitemap links</h6>
                                                <CButtonGroup vertical role="group" aria-label="Vertical button group">
                                                    <template v-for="(link,key) in s_links[sitemap_data.page - 1]" :key="key">
                                                        <CFormCheck type="checkbox" :button="{ color: 'primary', variant: 'outline' }" name="links" :id="`link_${(sitemap_data.page-1)}_${key}`" autocomplete="off" :label="link"/>
                                                    </template>              
                                                </CButtonGroup>
                                                <pagination v-model="local.page" :records="local.sitemap_links.length" :per-page="10" @paginate="console.log($event)"/>     
                                                <p class="text-danger mb-0" v-show="$has(errors.form,'sitemap')">{{errors.form.sitemap}}</p>								
                                                <p class="mb-0" v-show="!$has(errors.form,'sitemap')">You can select multiple site links</p>	                                                                                                                                                                       
                                            </CCol>                                                 
                                        </CRow>
                                        <CRow v-if="form.content_type  == 'website'">
                                            <CCol>
                                                <CFormInput label="Website Url" placeholder="eg. http://example.com" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"/>
                                                <p class="text-danger mb-0" v-show="$has(errors.form,'website')">{{errors.form.website}}</p>								
                                                <p class="mb-0" v-show="!$has(errors.form,'website')">Add a website link.</p>	                                         
                                            </CCol>
                                        </CRow>    
                                    </CCardBody>
                                </CCard>                                                                    
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
                        <p class="text-danger mb-0" v-show="$has(errors.form,'prompts')">{{errors.form.prompts}}</p>								
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
            <Chatbot :tools="form" :liveMode="live"/>            
          </CCol>
       </CRow>
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" @click="$emit('submitForm')" :disabled="disabled.createBtn || loading || live">
            <CSpinner v-show="loading" component="span" size="sm" aria-hidden="true"/>
            Save changes
        </CButton>
      </CModalFooter>
    </CModal>    
  </template>

<script>
import Chatbot from '@/components/Chatbot.vue';
import { chunk, cloneDeep, debounce, each, has, isEmpty, times } from 'lodash';
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
            }
        },
        modal:{
            get() {
                return this.show;
            },
            set (val) {
                this.$emit('updateModal',val)
            }
        }
    },
    created(){
        this.$has          = has;
        this.$isEmpty      = isEmpty;
        this.$times        = times;

        this.validateForm = (field) => {
            this.formSchema.validateAt(field, this.data)
                .then((value,key) => {
                    // console.log(value);
                    delete this.errors.form[field];
                })
                .catch((err) => {
                    this.errors.form[err.path] = err.message;
                });
        }
        this.validateLocal = (field) => {
            this.localSchema.validateAt(field, this.local)
                .then((value,key) => {
                    delete this.errors.local[field];
                })
                .catch((err) => {
                    this.errors.local[err.path] = err.message;
                });
        }
        this.validatePrompt= (field) => {
            this.promptSchema.validateAt(field, this.prompt)
                .then((value,key) => {
                    delete this.errors.prompt[field];
                })
                .catch((err) => {
                    this.errors.prompt[err.path] = err.message;
                });
        }   
        this.fetchSiteMap = debounce( (url) => {
            this.loader.sitemap = true;
            this.$api
                .post(`/ai/app/generate/sitemap`,{ url })
                .then( ({ data: { sitemap } }) => {
                    this.local.sitemap_links = cloneDeep(sitemap);
                    this.sitemap_data.pages  = chunk(cloneDeep(sitemap),10).length;
                })
                .catch( ({ response: { data } }) => {
                    this.$toast.error(data.message)
                })
                .finally( () => {
                    this.loader.sitemap = false;
                });
        },1000)    
        this.localSchema = yup.object().shape({
            sitemap_links:  yup.array()
                               .when(
                                    'sitemap_url',
                                    (sitemap_url,field) => !isEmpty(sitemap_url) ? 
                                            field.min(1, '*The application requires at least one link from the sitemap.')
                                                 .required("*Sitemap links is required")
                                        :   field
                                ),
            sitemap_url:   yup.string().required("*Sitemap url is required"),                        
        });        
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
                                .when(
                                    'content_type',
                                    (content_type,field) => content_type == 'documents' ? 
                                            field.min(1, '*The application requires at least one link from the sitemap.')
                                                 .required("*Sitemap links is required")
                                        :   field
                                ),
            model:           yup.string()						
                                .required("*Model is required"),  
            name:           yup.string()						
                                .required("*Name is required"),                                   
            sitemap:         yup.array()
                                .when(
                                    'content_type',
                                    (content_type,field) => content_type == 'sitemap' ? 
                                            field.min(1, '*The application requires at least one link from the sitemap.')
                                                 .required("*Sitemap links is required")
                                        :   field
                                ),
            welcome_message: yup.string()
                                .required("*Welcome message is required"),
            website:         yup.string()
                                .when(
                                    'content_type',
                                    (content_type,field) => content_type == 'website' ? 
                                            field.required("*Website is required")
                                        :   field
                                ),                                         
            input_placeholder: yup.string()
                                  .required("*Input placeholder is required"),  
            prompts:           yup.array()
                                  .min(1, '* The application requires at least one quick prompt')
                                  .required("*Prompts is required"),                                                         
        });
    }, 
    data(){
        return {
            collapse:{
                add: Boolean()
            },
            loader:{
                sitemap: Boolean()
            },
            local:{
                sitemap_links: Array(),
                sitemap_url:   String()
            },
            live: Boolean(),
            sitemap_data:{
                page:  1,
                pages: 0,
            },
            prompt:{
                description: String(),
                title:    String()
            },
            errors: {
                form:   {},
                local:  {},
                prompt: {}
            },
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
        },
        changeContentType(event){
            const { target: { value } } = event;
            this.form.content_type = value;
        },
        uploadFiles(event){
            const { target: { files } } = event;
            Array.from(files).forEach( (file) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    this.form.files.push(reader.result);
                };
                reader.onerror = function (error) {
                    console.log('Error: ', error);
                };
            });
        }        
    },
    name: "EditApp",
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
        local:{
            async handler(data){
                const self = this;
                each(data,(value,key) => {
                    self.validateLocal(key);
                });
            },
            deep: true,
        },
        "local.sitemap_url"(url){
            if( !isEmpty(url) ){
                this.fetchSiteMap(url);
            }
        },
        "data.content_type"(value){
            switch(value){
                case "sitemap":
                    this.form.website = String();
                    this.form.sitemap = Array();
                    this.form.files   = Array();
                break;
                case "website":
                    this.local = {
                        sitemap_links: Array(),
                        sitemap_url:   String()                        
                    }        
                    this.form.sitemap = Array();
                    this.form.files   = Array();
                break;
                case "documents":
                    this.local = {
                        sitemap_links: Array(),
                        sitemap_url:   String()                        
                    }    
                    this.form.sitemap = Array();
                    this.form.website = String();
                break;
            }
        },  
        "data.api_key"(value){
            if( !isEmpty(value) ){
                this.form.hash_key = UniqueCharOTP(70).toLowerCase();
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
                each(this.local,(value,key) => {
                    self.validateLocal(key);
                });                
                this.disabled.createBtn = !(await this.formSchema.isValid(this.form));                
            }
        },   
    }    
}
</script>