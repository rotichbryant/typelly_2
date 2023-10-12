import { Body, Controller, DefaultValuePipe, Delete, Get, HttpStatus,ParseIntPipe,  Post, Put, Req, Res, Param, Query, UseGuards, Sse } from '@nestjs/common';
import { AuthGuard } from '../../guards';
import { Request, Response } from 'express';
import { CreateAppValidation, CreatePromptValidation, UpdateAppValidation } from 'src/validation';
import { AppModel, PromptModel, UserModel } from 'src/models';
import { ConfigService } from '@nestjs/config';
import { cloneDeep,get, isEmpty, isNull, set } from 'lodash';
import { Paginate, PaginateQuery } from 'pagination-typeorm-nestjs';
import { OpenAIService } from 'src/services';
import { from, interval, map, Observable } from 'rxjs';

@Controller('ai/app')
export class AiAppController {

    constructor(
        private aiAppModel: AppModel,
        private promptModel: PromptModel,
        private openaiService: OpenAIService,
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
            const models = await this.openaiService.models();
            res.status(HttpStatus.OK).json({apps,models});
            
        } catch (e) {
            console.log(e);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({});
        }
    }

    @UseGuards(AuthGuard)
    @Post('create')
    async create(@Body() createApp: CreateAppValidation, @Req() req: Request, @Res() res: Response) {
        try {
            const { id } = get(req,'user');
            createApp['user_id'] = id;


            const app = await this.aiAppModel.save(createApp);

            Promise.all(
                createApp.prompts.map( async(prompt): Promise<any> => {
                    prompt = set(prompt,'app_id',app.id);
                    await this.promptModel.save(prompt);
                })
            );
            
            res.status(HttpStatus.OK).json({app});

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

    // @UseGuards(AuthGuard)
    @Sse('chatbot')
    async chatbot(@Res() res: Response): Promise<Observable<any>>{
        const stream   = await this.openaiService.createCompletion("Test");
        return from(stream).pipe(map((i) => ({ data: i })));
    } 

    @UseGuards(AuthGuard)
    @Delete(':appId/delete')
    async delete(@Req() req: Request,  @Res() res: Response) {
        res.status(HttpStatus.OK).json(req);
    } 

}
