import { Body, Controller, DefaultValuePipe, Delete, Get, HttpStatus,ParseIntPipe,  Post, Put, Req, Res, Param, Query, UseGuards, Sse } from '@nestjs/common';
import { AuthGuard } from '../../guards';
import { Request, Response } from 'express';
import { CreateAppValidation, CreatePromptValidation, GetModelsValidation, SitemapValidation, UpdateAppValidation } from 'src/validation';
import { AppModel, FileModel, PromptModel, SiteMapModel, UserModel } from 'src/models';
import { ConfigService } from '@nestjs/config';
import { cloneDeep,get, isEmpty, has, omit, set } from 'lodash';
import { Paginate, PaginateQuery } from '@ai-em/nestjs-paginate'
import { OpenAIService } from 'src/services';
import { from, interval, map, Observable } from 'rxjs';
import { HttpService } from '@nestjs/axios'; 
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { createFile } from 'src/common/helpers/storage.helper';
import ChromaHelper from 'src/common/helpers/chroma.helper';
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { JSONLoader, JSONLinesLoader } from "langchain/document_loaders/fs/json";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { PlaywrightWebBaseLoader, Page, Browser } from "langchain/document_loaders/web/playwright";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

@Controller('ai/app')
export class AiAppController {

    constructor(
        private aiAppModel: AppModel,
        private fileModel: FileModel,
        private httpService: HttpService,
        private promptModel: PromptModel,
        private openaiService: OpenAIService,
        private siteMapModel: SiteMapModel,
        private userModel: UserModel,
        private configService: ConfigService,
    ){}

    @UseGuards(AuthGuard)
    @Get('')
    async get( 
        @Req() req: Request,
        @Res() res: Response,
        @Paginate() query: PaginateQuery,
    ) {
        try{
            const { id } = get(req,'user');
            query.search = id;
            const apps   = await this.aiAppModel.get(query);
            res.status(HttpStatus.OK).json({apps});
        } catch (e) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({});
        }
    }

    @UseGuards(AuthGuard)
    @Post('models')
    async getModels( 
        @Res() res: Response,
        @Body() getModels: GetModelsValidation, 
    ) {
        try{
            let { data: models } = await this.openaiService.models({api_key:getModels.apiKey});
            // models               = models.filter( model => model.owned_by == 'openai' );
            res.status(HttpStatus.OK).json({models});        
        } catch (e) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({});
        }
    }

    @UseGuards(AuthGuard)
    @Post('create')
    async create(@Body() createApp: CreateAppValidation, @Req() req: Request, @Res() res: Response) {
        try {
            const { id } = get(req,'user'), path = require('path'), { getImageMime } = require('base64-image-mime');
            createApp['user_id'] = id;

            this.aiAppModel
                .save(omit(createApp,['prompts','files']))
                .then( (app) => {
                    Promise.all([
                        createApp.prompts.map( async(prompt: any): Promise<any> => {
                            prompt = set(prompt,'app_id',app.id);
                            await this.promptModel.save(prompt);
                        }),
                        createApp.sitemap.map( async(link: any): Promise<any> =>{
                            this.siteMapModel.save({
                                name: link,
                                app_id: app.id
                            });
                        }),

                        createApp.files.map( async(file: string): Promise<any> =>{
                            let [ type_1, type_2 ] = getImageMime(file).split('/');
                            let filename = `FILE_${new Date().getTime()}.${type_2}`;
                            
                            createFile(
                                `${process.cwd()}${path.sep}src${path.sep}storage${path.sep}public${path.sep}${app.id}`,
                                filename,
                                atob(file.split(',')[1]),                            
                            ).then( () =>{
                                this.fileModel.save({
                                    name: filename,
                                    app_id: app.id
                                });                             
                            });                                
                        })
                    ])
                    .then( async(): Promise<any> =>  {
                        try{
                            await app.sitemaps;
                            await app.files;

                            if( !isEmpty(app.sitemap) ){
                                let docs = Array();       

                                const vectorStore = new ChromaHelper(
                                    new OpenAIEmbeddings({
                                        openAIApiKey: app.api_key
                                    }),
                                    {
                                        collectionName: app.id,
                                        url: this.configService.get('VECTOR_DB_URL'), // Optional, will default to this value
                                        collectionMetadata: {
                                            "hnsw:space": "cosine",
                                        },
                                    }
                                );

                                const splitter = new RecursiveCharacterTextSplitter({
                                    chunkSize: 4000,
                                    chunkOverlap: 1,
                                    separators: ["|", "##", ">", "-"],
                                });

                                Promise.all(
                                    app.sitemap.map(
                                        async(link) => {
                                            const loader = new PlaywrightWebBaseLoader(link);
                                            const docs   = await loader.load();
                                            docs.push(docs[0])
                                            return docs[0];
                                        }
                                    )
                                ).then( async(documents) => {
                                    const docOutput = await splitter.splitDocuments(documents);                                                            
                                    vectorStore.addDocuments(docOutput);
                                    res.status(HttpStatus.OK).json({app});
                                });

                            }

                            if( !isEmpty(app.website_url) ){

                                const loader = new PlaywrightWebBaseLoader(app.website_url);
                                const docs   = await loader.load();
                                
                                const splitter = new RecursiveCharacterTextSplitter({
                                    chunkSize: 4000,
                                    chunkOverlap: 1,
                                    separators: ["|", "##", ">", "-"],
                                });
                                
                                const docOutput = await splitter.splitDocuments([docs[0]]);                            

                                const vectorStore = new ChromaHelper(
                                    new OpenAIEmbeddings({
                                        openAIApiKey: app.api_key
                                    }),
                                    {
                                        collectionName: app.id,
                                        url: this.configService.get('VECTOR_DB_URL'), // Optional, will default to this value
                                        collectionMetadata: {
                                            "hnsw:space": "cosine",
                                        },
                                    }
                                );

                                vectorStore.addDocuments(docOutput);
                                res.status(HttpStatus.BAD_GATEWAY).json({app});
                            }
                            
                            if( !isEmpty(app.files) ){

                                const loader = new DirectoryLoader(
                                    `${process.cwd()}${path.sep}src${path.sep}storage${path.sep}public${path.sep}${app.id}`,
                                    {
                                        ".json": (path) => new JSONLoader(path, "/texts"),
                                        ".jsonl": (path) => new JSONLinesLoader(path, "/html"),
                                        ".txt": (path) => new TextLoader(path),
                                        ".csv": (path) => new CSVLoader(path, "text"),
                                        ".pdf": (path) => new PDFLoader(path,{
                                            // you may need to add `.then(m => m.default)` to the end of the import
                                            pdfjs: () => import("pdfjs-dist/legacy/build/pdf.js")
                                        }),
                                    }
                                );  

                                // Create vector store and index the docs
                                const docs = await loader.load();

                                ChromaHelper.fromDocuments(
                                    docs,
                                    new OpenAIEmbeddings(), 
                                    {
                                        collectionName: app.id,
                                        url: this.configService.get('VECTOR_DB_URL'), // Optional, will default to this value
                                        collectionMetadata: {
                                            "hnsw:space": "cosine",
                                        }, // Optional, can be used to specify the distance method of the embedding space https://docs.trychroma.com/usage-guide#changing-the-distance-function
                                    }
                                ); 
                                res.status(HttpStatus.BAD_GATEWAY).json({app});
                            } 


                        } catch(err) {
                            console.log(err);
                            await this.aiAppModel.delete(app.id);
                            if( has(err.error,'message') ){
                                res.status(HttpStatus.BAD_REQUEST).json({ message: err.error.message}); 
                            }
                            res.status(HttpStatus.BAD_REQUEST).json(err); 
                        }                                              
                    });
                });
        } catch(e){
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({});
        }
    }  
    
    @UseGuards(AuthGuard)
    @Put(':appId/show')
    async show(@Param('appId') appId: string, @Res() res: Response) {
        try {
            const app = await this.aiAppModel.findOneBy({ id: appId });
            res.status(HttpStatus.OK).json({app});

        } catch(e){
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({});
        }
    }  

    @UseGuards(AuthGuard)
    @Post('generate/sitemap')
    async sitemap(@Body() generate: SitemapValidation, @Res() res: Response) {
        try {
            const Crawler   = require("simplecrawler");
            const siteCrawl = new Crawler(generate.url)
            let sitemap     = Array();

            siteCrawl.downloadUnsupported = false;
            siteCrawl.decodeResponses = true;
                
            siteCrawl.on("discoverycomplete",function(){
                const [ request, discovery ] = arguments;
                sitemap = discovery.filter( value => value.includes(generate.url) )
                                   .filter( value => !value.includes('.css') && !value.includes('.jpg') && !value.includes('.JPG') && !value.includes('.JPEG') && !value.includes('.js') && !value.includes('.png') && !value.includes('.php') )
                siteCrawl.stop();
                res.status(HttpStatus.OK).json({ sitemap });
            });

            siteCrawl.start(); 

        } catch(e){
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:'Something went wrong.'});
        }
    }  

    @UseGuards(AuthGuard)
    @Post(':appId/create/prompt')
    async createPrompt(@Param('appId') appId: string, @Body() createPrompt: CreatePromptValidation, @Req() req: Request,  @Res() res: Response) {
        try {
            createPrompt = set(cloneDeep(createPrompt),'app_id', appId);
            const prompt = await this.promptModel.save(createPrompt);
            res.status(HttpStatus.OK).json({prompt});

        } catch(e){
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({});
        }
    } 

    @UseGuards(AuthGuard)
    @Post(':appId/update')
    async update(@Param('appId') appId: string,@Body() updateApp: UpdateAppValidation,  @Res() res: Response) {
        try {
            
            await this.aiAppModel.update(appId,updateApp);
            const app = await this.aiAppModel.findOneBy({ id: appId });

            res.status(HttpStatus.OK).json({app});

        } catch(e){
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({});
        }
    } 

    @UseGuards(AuthGuard)
    @Delete(':appId/delete')
    async delete(@Param('appId') appId: string, @Req() req: Request,  @Res() res: Response) {
        await this.aiAppModel.delete(appId);
        res.status(HttpStatus.OK).json();
    } 

}
