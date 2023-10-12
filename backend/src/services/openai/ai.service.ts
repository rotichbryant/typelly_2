import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { subscribe } from "diagnostics_channel";
import Configuration from 'openai';
import OpenAIapi from 'openai';
import { OpenAI } from "langchain/llms/openai";
import { isEmpty } from 'lodash';

@Injectable()
export class OpenAIService{

    private aiconfig;

    private openai;

    constructor(
        private configServer: ConfigService,
    ){
        this.aiconfig = new Configuration({
            apiKey: this.configServer.get('OPENAI_API_KEY')
        });

        this.aiconfig.timeout = 20 * 1000,
        this.openai = new OpenAIapi(this.aiconfig);
    }

    getCompletion(){
        return this.openai.chat.completions.create({
            messages: [{ role: 'user', content: 'Who am I ?' }],
            model: 'gpt-3.5-turbo',
          });
    }

    async createCompletion(prompt) {
        return await this.openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            stream: true,
        });    
    }

    async models(){
        return await this.openai.models.list();
    }

    async engines(){
        console.log(this.openai);
        return await this.openai.listEngines();
    }

    async chatModels(){
        console.log(this.openai);
        return await this.openai.Model.list();
    }
} 