
<template>
    <CCard class="sticky-top col-md-12">
        <CHeader class="justify-content-center">
            <CCardTitle class="my-0">
                {{ chatbot.name || "ChatBot Name" }}              
            </CCardTitle>
            <CBadge color="danger" position="top-center" shape="rounded-pill" v-show="liveMode">
                Live
            </CBadge>      
            <CBadge color="success" position="top-center" shape="rounded-pill" v-show="!liveMode">
                Testing
            </CBadge>        
        </CHeader>
        <CCardBody>
            <CContainer fluid class="h-100">
                <CRow class="h-100" v-if="!loading.chatbot">
                    <CCol md="12" xs="12" class="direct-chat-messages p-0" v-show="!liveMode">
                        <div class="direct-chat-msg">
                            <!-- /.direct-chat-info -->
                            <CAvatar color="primary" class="direct-chat-img" text-color="white">
                                <CIcon name="cib-probot" size="lg"/>
                            </CAvatar> 
                            <!-- <img class="direct-chat-img" src="https://bootdey.com/img/Content/user_1.jpg" alt="Message User Image">/.direct-chat-img -->
                            <div class="direct-chat-text">
                                {{ chatbot.welcome_message || "Welcome Message" }}<br>
                                <span class="direct-chat-timestamp pull-left text-sm">23 Jan 2:00 pm</span>
                            </div>
                            <!-- /.direct-chat-text -->
                        </div>
                        <!-- /.direct-chat-msg -->

                        <!-- Message to the right -->
                        <div class="direct-chat-msg right mt-3">
                            <!-- /.direct-chat-info -->
                            <CAvatar color="primary" class="direct-chat-img" text-color="white">
                                <CIcon name="cil-user" size="lg"/>
                            </CAvatar>                
                            <div class="direct-chat-text">
                                You better believe it! <br>
                                <span class="direct-chat-timestamp pull-left">23 Jan 2:05 pm</span>
                            </div>
                            <!-- /.direct-chat-text -->
                        </div>
                        <!-- /.direct-chat-msg -->                    
                    <!-- Message. Default to the left -->
                    </CCol>
                    <CCol md="12" xs="12" class="direct-chat-messages p-0" v-show="liveMode">
                        <template v-for="(message,key) in messages" :key="`${key}_${message.type}`" >
                            <div class="direct-chat-msg" v-show="message.type == 'answer'">
                                <!-- /.direct-chat-info -->
                                <CAvatar color="primary" class="direct-chat-img" text-color="white">
                                    <CIcon name="cib-probot" size="lg"/>
                                </CAvatar> 
                                <!-- <img class="direct-chat-img" src="https://bootdey.coms/img/Content/user_1.jpg" alt="Message User Image">/.direct-chat-img -->
                                <div class="direct-chat-text">
                                    <template v-if="message.loading">
                                        <div class="p-2"><div class="typing-loader"></div></div>
                                    </template>
                                    <template v-else>
                                        <div v-html="message.content"></div> <br>
                                        <span class="direct-chat-timestamp pull-left">{{ message.create_at  }}</span>
                                    </template>
                                </div>
                                <!-- /.direct-chat-text -->
                            </div>
                            <!-- /.direct-chat-msg -->

                            <!-- Message to the right -->
                            <div class="direct-chat-msg right mt-3"  v-show="message.type == 'question'">
                                <!-- /.direct-chat-info -->
                                <CAvatar color="primary" class="direct-chat-img" text-color="white">
                                    <CIcon name="cil-user" size="lg"/>
                                </CAvatar>                
                                <div class="direct-chat-text">
                                    {{ message.content }} <br>
                                    <span class="direct-chat-timestamp pull-left">{{ message.create_at  }}</span>
                                </div>
                                <!-- /.direct-chat-text -->
                            </div>
                            <!-- /.direct-chat-msg -->  
                        </template> 
                                           
                    </CCol>
                    <CCol md="12" xs="12" class="d-flex flex-row flex-wrap mt-5 px-0 align-items-end">
                        <template v-for="(prompt,key) in chatbot.prompts" :key="`${prompt.description}_${key}`" >
                            <CButton color="primary" type="button" class="m-1" shape="rounded-pill" size="sm" v-if="!liveMode">{{ prompt.description }}</CButton>
                            <CButton color="primary" @click="askPrompt(prompt)" class="m-1" shape="rounded-pill" size="sm" v-else>{{ prompt.description }}</CButton>
                        </template>
                    </CCol>
                </CRow>
                <CRow class="d-flex h-100" v-else="loading.chatbot">
                    <CCol class="text-center">
                        <CSpinner component="span" size="lg" aria-hidden="true"/>                    
                    </CCol>
                </CRow>
            </CContainer>
        </CCardBody>
        <CFooter class="bg-white" style="">
            <CForm class="col-12" @submit.prevent="submit" v-if="liveMode">
                <CInputGroup class="my-2">
                    <CFormInput v-model="question" :placeholder="chatbot.input_placeholder || 'Placeholder text'" />
                    <CButton type="submit" :disabled="loading.question" color="primary" variant="outline" id="button-addon2">
                        <CSpinner v-show="loading.question" component="span" size="sm" aria-hidden="true"/>                    
                        Send
                    </CButton>
                </CInputGroup>
            </CForm>
            <CInputGroup class="my-2" v-else>
                <CFormInput :placeholder="chatbot.input_placeholder || 'Placeholder text'" />
                <CButton type="button" color="primary" variant="outline" id="button-addon2">Send</CButton>
            </CInputGroup>            
        </CFooter>
    </CCard>    
</template>
<script lang="ts" >
    import { EventSourcePolyfill } from 'event-source-polyfill'
    import moment from 'moment';
    import { cloneDeep } from 'lodash';
    export default {
        beforeCreate(){ 

            this.initializeLiveMode = () => {
                const { chatbot: { id, welcome_message} } = this;
                this.loading.chatbot = true;
                this.$api
                    .post(`chatbot/${id}/create`,{content: welcome_message, type: 'answer'})
                    .then( ({ data: { chatbot, message} }) => {
                        message.create_at = moment(message.create_at).format('D MMM YY h:mm a');
                        this.botInfo      = cloneDeep(chatbot);
                        this.question     = String();
                        this.messages.push(message);    
                    })
                    .catch( () => {
                    })
                    .finally( () => {
                        this.loading.chatbot = false;
                    });                            
            }

            this.initializeTestMode = () => {
                this.question = String();
                this.messages = Array();
                this.loading  = Boolean();
            }
        },        
        computed:{
            chatbot(){
                return this.tools;
            },
            mode_badge(): String{
                return this.live ? "Live" : "Testing";
            }
        }, 
        create(){
            this.$set(this,"moment",moment);
        },
        data(){
            return {
                botInfo:  Object(),
                loading:  {
                    chatbot: Boolean(),
                    response: Boolean(),
                    question: Boolean()
                },
                token:    String(),
                messages: Array(),
                question: String()
            }
        },
        methods:{
            askPrompt({ description }){
                this.question = description;
            },
            submit(){
                const { botInfo:{ id }, question } = this;
                this.$api
                    .post(`chatbot/${id}/update`,{content: question, type: 'question'})
                    .then( ({ data: { message} }) => {
                        message.create_at = moment(message.create_at).format('D MMM YY h:mm a');
                        this.messages.push(message);    
                        this.loading.question = true
                        this.getResponse(message.id);
                    })
                    .catch( () => {
                    })
                    .finally( () => {
                        // this.loading.question = false

                    });                  
            },
            getResponse(id){
                this.messages.push({ loading: true, type:'answer', content: ''});

                const { 
                    $store:{ 
                        getters: { 
                            authToken: { token_type, token }, 
                            env:       { VITE_API_BASE_URL } 
                        } 
                    } 
                } = this;

                let es = new EventSourcePolyfill(`${VITE_API_BASE_URL}/chatbot/${id}/response`,{
                    headers: {
                        'Authorization': `${token_type} ${token}`, // or localStorage.getItem("myToken"),
                        'Allow-Origin': '*'
                    }
                });

                es.addEventListener("message", ({data}) => {
                    const { delta:{ content }, finish_reason } = JSON.parse(data);

                    if( finish_reason == "stop"){
                        this.loading.question = false;
                        this.question         = String();
                        this.registerResponse();
                        es.close();
                    } 

                    if( finish_reason == null ){
                        if( this.messages[(this.messages.length - 1)].loading ){
                            this.messages[(this.messages.length - 1)].loading = false;
                        }
                        this.messages[(this.messages.length - 1)].content += content;
                    }
                }); 
            },
            registerResponse(){
                const { botInfo:{ id } } = this;
                const content            = this.messages[(this.messages.length - 1)]
                this.$api
                    .post(`chatbot/${id}/update`,content)
                    .then( ({ data: { message } }) => {
                        this.messages[(this.messages.length - 1)].create_at = moment(message.create_at).format('D MMM YY h:mm a');
                    })
                    .catch( () => {
                    })
                    .finally( () => {
                        // this.loading.question = false

                    }); 
            }
        },
        props:{
            liveMode:{
                type: Boolean,
                default: Boolean()
            },
            tools:{
                type: Object,
                default: Object()
            }
        },
        watch:{
            liveMode(value){
                if( value ){
                    this.initializeLiveMode();
                } else {
                    this.initializeTestMode()
                }
            }
        }
    }
</script>
<style scoped lang="scss">
@import"@/assets/styles/_custom.scss";
</style>