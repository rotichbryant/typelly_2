import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';;
import { UserModel } from 'src/models';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

    constructor(
        private userModel: UserModel,
        private configService: ConfigService,
        private jwtService: JwtService
    ){}

    async findOneByEmail(email: string){
        return await this.userModel.findOneBy({email});
    }

    async signIn(user:any): Promise<any>{
        
        return {
            token_type: `Bearer`,
            token:      this.jwtService.sign(user)
        };
    }

}
