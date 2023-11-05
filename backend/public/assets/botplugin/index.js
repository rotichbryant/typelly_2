if( null != document.currentScript.getAttribute('hashKey') ){
    const hashKey = document.currentScript.getAttribute('hashKey');
    const src     = document.currentScript.getAttribute('src');
    Promise.all([
        new Promise( (resolve) => {
            const bot = document.createElement('div');
            bot.setAttribute('id','bot');
            bot.setAttribute('class','');
            document.querySelector('body').appendChild(bot);
            resolve(true);
        }),
        new Promise( (resolve) => {
            const script = document.createElement('script');
            script.setAttribute('type','text/javascript');
            script.setAttribute('src','https://unpkg.com/vue@3/dist/vue.global.js');
            document.querySelector('body').appendChild(script);

            resolve(true);
        })
    ]).then( () => {
        setTimeout( () => {
            const { createApp, ref } = Vue;
            createApp({
                template: `
                    <button class="chatbot__button" @click="show = !show">
                        <i class="fa fa-comments fa-lg"></i>
                    </button>
                    <div class="chatbot">
                        <!-- DIRECT CHAT PRIMARY -->
                        <div class="box box-primary direct-chat direct-chat-primary">
                            <div class="box-header with-border">
                            <h3 class="box-title">{{ app.name }}</h3>                
                            <div class="box-tools pull-right">
                                <button type="button" class="btn btn-box-tool" data-widget="remove"><i class="fa fa-times"></i></button>
                            </div>
                            </div>
                            <!-- /.box-header -->
                            <div class="box-body">
                            <!-- Conversations are loaded here -->
                            <div class="direct-chat-messages" v-show="!loading.init">
                                <template v-for="(message,index) in messages">
                                    <!-- Message. Default to the left -->
                                    <div class="direct-chat-msg" v-show="message.type == 'answer'">
                                        <!-- /.direct-chat-info -->
                                        <div class="direct-chat-img">
                                            <i class="fa fa-robot fa-lg"></i>                            
                                        </div>
                                        <!-- /.direct-chat-img -->
                                        <div class="direct-chat-text">
                                            <template v-if="message.loading">
                                                <div class="loading"><div class="typing-loader"></div></div>
                                            </template>
                                            <template v-else>
                                                <div v-html="message.content"></div> <br>
                                                <span class="direct-chat-timestamp pull-left">{{ message.created_at  }}</span>
                                            </template>                                     
                                        </div>
                                        <!-- /.direct-chat-text -->
                                    </div>
                                    <!-- /.direct-chat-msg -->
                            
                                    <!-- Message to the right -->
                                    <div class="direct-chat-msg right" v-show="message.type == 'question'">
                                        <!-- /.direct-chat-info -->
                                        <div class="direct-chat-img">
                                            <i class="fa fa-user fa-lg"></i>                            
                                        </div>
                                        <!-- /.direct-chat-img -->
                                        <div class="direct-chat-text">
                                            {{ message.content }} <br/>
                                            <span class="direct-chat-timestamp pull-left">{{ message.created_at }}</span>
                                        </div>
                                        <!-- /.direct-chat-text -->
                                    </div>
                                    <!-- /.direct-chat-msg -->
                                </template>
                            </div>
                            <div class="direct-chat-init" v-show="loading.init">
                                <p><i class="fa fa-spinner fa-spin"></i> Loading</p>
                            </div>
                            <!--/.direct-chat-messages-->            
                            <!-- /.direct-chat-pane -->
                            </div>
                            <!-- /.box-body -->
                            <div class="box-footer">
                                <form @submit.prevent="send" method="POST">
                                    <div class="input-field">
                                        <input type="text" name="message" :disabled="loading.send" v-model="input_message" :placeholder="app.input_placeholder" class="form-control">
                                        <button type="submit" :disabled="loading.send" class="chatbtn">
                                            <template v-if="loading.send"><i class="fa fa-spinner fa-spin"></i></template>    
                                            <template v-else>Send</template>                                      
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <!-- /.box-footer-->
                        </div>
                        <!--/.direct-chat -->
                    </div>                                                                 
                `,
                async beforeCreate(){
                    try {
                        
                        const response = await fetch(
                            `${src}/${hashKey}/live`,
                            {
                                method: "PUT", // *GET, POST, PUT, DELETE, etc.
                                mode: "cors", // no-cors, *cors, same-origin
                                cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                                headers: {
                                    "Content-Type": "application/json",
                                },
                            }
                        );

                        const { app }  = await response.json();

                        this.app = app;
                        console.log(this.app);
                    } catch (err) {

                    }
                },
                async created(){
                    const response = await fetch(`${src}/styling`);
                    const style = document.createElement('style');
                    style.innerHTML = await response.text();
                    document.querySelector('body').appendChild(style);
                },
                data(){
                    return {
                        app:           Object(),
                        chatbot:       Object(),
                        input_message: String(),
                        loading:       {
                            send: Boolean(),
                            init: Boolean()
                        },
                        messages:      Array(),
                        show:         false
                    }
                },
                methods:{
                    async answer(source){
                        source.onmessage = async (event) => {
                            const { result, sourceDocuments } = JSON.parse(event.data);

                            try {
                                const response = await fetch(
                                    `${src}/${this.chatbot.id}/update`,
                                    {
                                        method: "POST", // *GET, POST, PUT, DELETE, etc.
                                        mode: "cors", // no-cors, *cors, same-origin
                                        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({
                                            type:    "answer",
                                            content: result
                                        })
                                    }
                                );
                                
                                source.close();             

                                const { message }                 = await response.json();
    
                                this.messages[(this.messages.length-1)].content    = message.content
                                this.messages[(this.messages.length-1)].loading    = Boolean();
                                this.messages[(this.messages.length-1)].created_at = message.created_at;

                                this.input_message                  = String();
                                this.loading.send                   = Boolean();
    
                            } catch(err) {
                                console.log(err);
                            }                            
                        };
                       
                    },
                    async initialize(){
                        try {
                            const response = await fetch(
                                `${src}/${hashKey}/create`,
                                {
                                    method: "POST", // *GET, POST, PUT, DELETE, etc.
                                    mode: "cors", // no-cors, *cors, same-origin
                                    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        type:"answer",
                                        content: this.app.welcome_message
                                    })
                                }
                            );

                            const { message, chatbot } = await response.json();

                            this.loading.init = Boolean(); 
                            this.messages.push(message);
                            this.chatbot = chatbot;      

                        } catch(err) {

                            console.log(err);
                            
                        }                  
                    },
                    async send(){
                        this.loading.send = Boolean(true);
                        try {
                            const response = await fetch(
                                `${src}/${this.chatbot.id}/update`,
                                {
                                    method: "POST", // *GET, POST, PUT, DELETE, etc.
                                    mode: "cors", // no-cors, *cors, same-origin
                                    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        type:    "question",
                                        content: this.input_message
                                    })
                                }
                            );
                            
                            const { message }  = await response.json();

                            this.messages.push(message);
                            this.messages.push({ content: "", loading: true, type: "answer" });

                            const source = new EventSource(`${src}/${message.id}/response`);
                            this.answer(source);

                        } catch(err) {
                            console.log(err);
                        }                   
                    }
                },
                mounted(){
                    this.loading.init = Boolean(true);
                    setTimeout( () => {
                        this.initialize();
                    },1000)
                },
                watch:{
                    show(val){
                        if(val){
                            document.body.querySelector('#bot').classList.toggle('show-chatbot');
                        } else {
                            document.body.querySelector('#bot').classList.remove('show-chatbot');
                        }
                    }
                }
            }).mount('#bot');
        },4000)
    });

}
