import { Body, Controller, HttpStatus, Ip, Param, Post, Put, Get, Sse, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard, ChatBotGuard } from '../../guards';
import { Request, Response } from 'express';
import { AppModel, ChatBotModel } from 'src/models';
import { ConfigService } from '@nestjs/config';
import { AuthService, OpenAIService } from 'src/services';
import { CreateMessageValidation, QuestionValidation } from 'src/validation';
import { MessageModel } from 'src/models/message.model';
import { isEmpty, set } from 'lodash';
import { Observable, from, map } from 'rxjs';

@Controller('chatbot')
export class ChatbotController {

    constructor(
        private aiAppModel: AppModel,
        private authService: AuthService,
        private chatbotModel: ChatBotModel,
        private messageModel: MessageModel,
        private openaiService: OpenAIService,
        private configService: ConfigService,
    ){}

    @UseGuards(AuthGuard)
    @Put('auth/:appId/live')
    async authLive(@Param('appId') appId: string, @Req() req: Request, @Res() res: Response) {
        try{

            const randomstring = require("randomstring");
            const hash_key     = randomstring.generate(75);
            
            await this.aiAppModel.update(appId,{hash_key});

            const app          = await this.aiAppModel.findOneBy({id:appId});
            
            return res.status(HttpStatus.OK).json({app});

        } catch(err){
            console.log(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({});

        }  
    } 

    @UseGuards(AuthGuard)
    @Post(':appId/create')
    async create(@Body() createMessage: CreateMessageValidation, @Param('appId') appId: string, @Req() req: Request, @Res() res: Response) {
        try{
            const chatbot = await this.chatbotModel.save({ app_id: appId });
            createMessage = set(createMessage,"chatbot_id",chatbot.id);

            const message = await this.messageModel.save(createMessage);

            return res.status(HttpStatus.OK).json({chatbot,message});

        } catch(err){
            console.log(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({});

        }  
    } 

    @UseGuards(AuthGuard)
    @Post(':chatbotId/update')
    async update(@Body()  createMessage: CreateMessageValidation,@Param('chatbotId') chatbotId: string, @Req() req: Request, @Res() res: Response) {
        try{

            createMessage = set(createMessage,"chatbot_id",chatbotId);
            const message = await this.messageModel.save(createMessage);

            return res.status(HttpStatus.OK).json({message});

        } catch(err){

            console.log(err);

            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({});

        }  
    } 

    @UseGuards(AuthGuard)
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
                    return { data: data.text  } as MessageEvent; 
                })
            );

        } catch(e){
            console.log(e);
            res.status(e.status).json({ message: e.error.message });
        }
    }     

}
