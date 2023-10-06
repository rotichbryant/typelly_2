
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
                <CRow class="h-100">
                    <CCol md="12" xs="12" class="direct-chat-messages p-0" v-show="!liveMode">
                        <div class="direct-chat-msg">
                            <!-- /.direct-chat-info -->
                            <CAvatar color="secondary" class="direct-chat-img" text-color="white">
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
                                <CAvatar color="secondary" class="direct-chat-img" text-color="white">
                                    <CIcon name="cib-probot" size="lg"/>
                                </CAvatar> 
                                <!-- <img class="direct-chat-img" src="https://bootdey.coms/img/Content/user_1.jpg" alt="Message User Image">/.direct-chat-img -->
                                <div class="direct-chat-text">
                                    {{ message.content }}<br>
                                    <span class="direct-chat-timestamp pull-left text-sm">{{ message.date }}</span>
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
                                    <span class="direct-chat-timestamp pull-left">{{ message.date }}</span>
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
            </CContainer>
        </CCardBody>
        <CFooter class="bg-white" style="">
            <CForm class="col-12" @submit.prevent="submit" v-if="liveMode">
                <CInputGroup class="my-2">
                    <CFormInput v-model="question" :placeholder="chatbot.input_placeholder || 'Placeholder text'" />
                    <CButton type="submit" color="primary" variant="outline" id="button-addon2">Send</CButton>
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
    import { useEventSource } from '@vueuse/core'
    import moment from 'moment';
    export default {
        beforeCreate(){
            this.initializeLiveMode = () => {
                // this.loading = true;
                this.messages.push({type: 'answer', content: this.chatbot.welcome_message, date: moment().format('D MMM YY h:mm a')  });                
            }
            this.initializeTestMode = () => {
                this.question = String();
                this.messages = Array();
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
        data(){
            return {
                loading: Boolean(),
                messages: Array(),
                question: String()
            }
        },
        methods:{
            askPrompt({ description }){
                this.question = description;
            },
            submit(){
                this.messages.push({ type: 'question', content: this.question, date: moment().format('D MMM YY h:mm a')  });
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