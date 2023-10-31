import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { subscribe } from "diagnostics_channel";
import Configuration from 'openai';
import OpenAIapi from 'openai';
import { OpenAI } from "langchain/llms/openai";
import { isEmpty } from 'lodash';
import { AppModel } from "src/models";
import ChromaHelper from "src/common/helpers/chroma.helper";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PromptTemplate } from "langchain/prompts";
import {
    RunnableSequence,
    RunnablePassthrough,
  } from "langchain/schema/runnable"
import { StringOutputParser } from "langchain/schema/output_parser";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { Document } from "langchain/document";
import { ExceptionsHandler } from "@nestjs/core/exceptions/exceptions-handler";
import { RetrievalQAChain } from "langchain/chains";

@Injectable()
export class OpenAIService{

    constructor(
        private configService: ConfigService,
    ){}

    async search({ content, chatbot: { app }}){
        try {
            const model = new OpenAI({
                // streaming: true,
                modelName: app.model, 
                temperature: 0,
                openAIApiKey: app.api_key, // In Node.js defaults to process.env.OPENAI_API_KEY
            }),
            vectorStore   = await ChromaHelper.fromExistingCollection(
                new OpenAIEmbeddings(),
                { 
                    collectionName: app.id,
                    url: this.configService.get('VECTOR_DB_URL'), 
                }
            ),
            // prompt        = PromptTemplate.fromTemplate(
            //     `Answer the question based only on the following context:{context}, 
            //     Question: {question}`
            // ),
            // serializeDocs = (docs: Document[]) =>docs.map((doc) => doc.pageContent).join("\n"),
            // Create a chain that uses the OpenAI LLM and HNSWLib vector store.
            chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());
            return await chain.stream({
                query: content
            });      
        } catch (err) {
            throw err;
        }
    }

    async models(){
        const openai = new OpenAIapi();
        return await openai.models.list();
    }

} 