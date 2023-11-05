import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAIApi from 'openai';
import { OpenAI } from "langchain/llms/openai";
import ChromaHelper from "src/common/helpers/chroma.helper";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { ChatPromptTemplate, HumanMessagePromptTemplate, PromptTemplate, SystemMessagePromptTemplate } from "langchain/prompts";
import {
    RunnableSequence,
    RunnablePassthrough,
  } from "langchain/schema/runnable"
import { StringOutputParser } from "langchain/schema/output_parser";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { Document } from "langchain/document";
import { ExceptionsHandler } from "@nestjs/core/exceptions/exceptions-handler";
import { RetrievalQAChain } from "langchain/chains";
import { formatDocumentsAsString } from "langchain/util/document";
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
                new OpenAIEmbeddings({
                    openAIApiKey: app.api_key                
                }),
                { 
                    collectionName: app.id,
                    url: this.configService.get('VECTOR_DB_URL'), 
                }
            ),
            // Create a system & human prompt for the chat model
            SYSTEM_TEMPLATE = `Use the following pieces of context to answer the users question.
            If you don't know the answer, just say that you don't know, don't try to make up an answer.
            ----------------
            {context}`,
            messages = [
                SystemMessagePromptTemplate.fromTemplate(SYSTEM_TEMPLATE),
                HumanMessagePromptTemplate.fromTemplate("{question}"),
            ],
            prompt = ChatPromptTemplate.fromMessages(messages),
            // Create a chain that uses the OpenAI LLM and HNSWLib vector store.
            // chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());
            // chain.returnSourceDocuments = true;
            chain = RunnableSequence.from([
                {
                    // Extract the "question" field from the input object and pass it to the retriever as a string
                    sourceDocuments: RunnableSequence.from([
                    (input) => input.question,
                        vectorStore.asRetriever(),
                    ]),
                    question: (input) => input.question,
                },
                {
                    // Pass the source documents through unchanged so that we can return them directly in the final result
                    sourceDocuments: (previousStepResult) => previousStepResult.sourceDocuments,
                    question: (previousStepResult) => previousStepResult.question,
                    context: (previousStepResult) =>
                    formatDocumentsAsString(previousStepResult.sourceDocuments),
                },
                {
                    result: prompt.pipe(model).pipe(new StringOutputParser()),
                    sourceDocuments: (previousStepResult) => previousStepResult.sourceDocuments,
                },
            ]);
                          
            return await chain.stream({
                question: content
            });      

        } catch (err) {
            throw err;
        }
    }

    async models({api_key}){
        const openai = new OpenAIApi({apiKey: api_key });
        return await openai.models.list();
    }

} 