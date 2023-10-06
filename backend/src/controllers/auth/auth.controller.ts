import { Body, Controller, Get, HttpStatus, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../guards';
import { Request, Response } from 'express';
import { AuthService, MailService } from 'src/services';
import { RegisterValidation } from 'src/validation';
import { CompanyModel, RoleModel, UserModel } from 'src/models';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { isEmpty, isNull } from 'lodash';

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService,
        private companyModel: CompanyModel,
        private configService: ConfigService,
        private mailService: MailService,
        private roleModel: RoleModel,
        private userModel: UserModel
    ){}

    @Post('login')
    async login(@Req() req: Request,  @Res() res: Response){
        const { email, password } = req.body;
        try{
            const user = await this.authService.findOneByEmail(email);
            if( !isNull(user) ){
                // const hash    = await bcrypt.hash(password, parseInt(this.configService.get('SALT_LENGTH')));
                const isMatch = await bcrypt.compare(password,user.password);
                if( isMatch ){
                    const token = await this.authService.signIn({user,password});
                    return res.status(HttpStatus.OK).json({user,token});;
                } else {
                    return res.status(HttpStatus.UNAUTHORIZED).json({});
                }
            } else if(isNull(user)) {
                return res.status(HttpStatus.NOT_FOUND).json({});
            }
        } catch(err){
            return res.status(HttpStatus.GATEWAY_TIMEOUT);
        }
    }

    @Post('signup')
    async signup(@Body() registerUser: RegisterValidation, @Res() res: Response){
        try{
            const randomstring      = require("randomstring");
            const { id: companyId } = await this.companyModel.first();
            const { id: roleId }    = await this.roleModel.findOneBy({ name: 'client'});

            registerUser.password      = await bcrypt.hash(registerUser.password, parseInt(this.configService.get('SALT_LENGTH')));
            registerUser['token']      = randomstring.generate(100);
            registerUser['company_id'] = companyId;
            registerUser['role_id']    = roleId;
            delete registerUser.confirm_password;

            const user = await this.userModel.save(registerUser);
            await this.mailService.sendUserConfirmation(user);

            res.status(HttpStatus.OK).json({user});

        } catch(e) {
            throw new Error("Something went wrong. Please try again.");            
        }   
    }

    @UseGuards(AuthGuard)
    @Get('user')
    getProfile(@Req() req: Request,  @Res() res: Response) {
        res.status(HttpStatus.OK).json(req['user']);
    } 

    @Post('ai')
    async ai_login(@Req() req: Request,  @Res() res: Response) {
        res.status(HttpStatus.OK).json(req['user']);
    } 

}
