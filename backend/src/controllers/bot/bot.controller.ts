import { Body, Controller, Get, Header, HttpCode, HttpStatus, Param, Post, Put, Req, Res, Sse } from '@nestjs/common';
import { AppModel, ChatBotModel, MessageModel } from 'src/models';
import { join, sep} from 'path';
import { readFileSync } from 'fs';
import { Request, Response } from 'express';
import { pick, set } from 'lodash';
import { CreateMessageValidation } from 'src/validation';
import { Observable, from, map } from 'rxjs';
import { OpenAIService } from 'src/services';

@Controller('bot')
export class BotController {

    constructor(
        private appModel: AppModel,
        private chatModel: ChatBotModel,
        private messageModel: MessageModel,
        private openaiService: OpenAIService,
    ){}

    @Get('')
    @HttpCode(200)
    @Header('Content-Type', 'text/js')
    launch(){
        return readFileSync(join(`${process.cwd()}${sep}public${sep}assets${sep}botplugin${sep}`,'index.js'), {encoding: "utf8" });
    }

    @Get('styling')
    @HttpCode(200)
    @Header('Content-Type', 'text/css')
    styling(){
        return readFileSync(join(`${process.cwd()}${sep}public${sep}assets${sep}botplugin${sep}`,'index.css'), {encoding: "utf8" });
    }
    
    @Put(':hashKey/live')
    async authLive(@Param('hashKey') hashKey: string, @Req() req: Request, @Res() res: Response) {
        try{

            const app          = await this.appModel.findOneBy({hash_key:hashKey});    
            return res.status(HttpStatus.OK).json({app: pick(app,['name','input_placeholder','welcome_message'])});

        } catch(err){
            console.log(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({});

        }  
    } 

    @Post(':hashKey/create')
    async create(@Body() createSession: CreateMessageValidation, @Param('hashKey') hashKey: string, @Req() req: Request, @Res() res: Response) {
        try{
            const moment  = require('moment');
            const app     = await this.appModel.findOneBy({ hash_key: hashKey });
            const chatbot = await this.chatModel.save({ app_id: app.id });
            
            createSession = set(createSession,"chatbot_id",chatbot.id);

            const message = await this.messageModel.save(createSession);
            message.created_at = moment(message.created_at).format('lll');

            return res.status(HttpStatus.OK).json({chatbot,message});

        } catch(err){
            console.log(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({});

        }  
    }

    @Post(':chatbotId/update')
    async update(@Body()  createMessage: CreateMessageValidation,@Param('chatbotId') chatbotId: string, @Req() req: Request, @Res() res: Response) {
        try{
            const moment  = require('moment');
            createMessage = set(createMessage,"chatbot_id",chatbotId);
            let message = await this.messageModel.save(createMessage);
            message.created_at = moment(message.created_at).format('lll');

            return res.status(HttpStatus.OK).json({message});

        } catch(err){

            console.log(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({});

        }  
    } 

    @Sse(':messageId/response')
    async chatbot(@Param('messageId') messageId: string, @Req() req: Request, @Res() res: Response): Promise<Observable<any>> {
        try{
           
            const message      = await this.messageModel.findOneBy({id: messageId });
            const stream       = await this.openaiService.search(message);
            const { Readable } = require("stream");
            const getData      = Readable.from(stream);

            return from( 
                new Observable().pipe(
                    () => getData.on("data", (chunk) => {
                        return chunk;
                    })
                )

            ).pipe(
                map( (data:any) => {
                    return { data: JSON.stringify(data) } as MessageEvent; 
                })
            );

        } catch(e){
            console.log(e);
            res.status(e.status).json({ message: e.error.message });
        }
    }

}
