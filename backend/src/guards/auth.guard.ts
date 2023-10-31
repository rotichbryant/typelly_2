import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { Request } from 'express';
  import { DataSource } from 'typeorm';
  import { UserEntity } from '../entities';
  import { set } from 'lodash';
import { ConfigService } from '@nestjs/config';
  
  @Injectable()
  export class AuthGuard implements CanActivate {
  
    private readonly userEntity;
    
    constructor(
      private jwtService: JwtService,
      private configService: ConfigService,
      @Inject(DataSource) private readonly dataSource: DataSource    
    ) {
      this.userEntity = this.dataSource.getRepository(UserEntity);
    }
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      if (token == undefined) {
        throw new UnauthorizedException();
      }
      try {
        const { user: { email } } = await this.jwtService.verifyAsync(token,{secret: this.configService.get('JWT_SESSION_KEY') });
        // 💡 We're assigning the payload to the request object here
        // so that we can access it in our route handlers
        set(request,'user', await this.userEntity.findOneBy({email}));
        // request.user =;
      } catch(err) {
        throw new UnauthorizedException();
      }
      return true;
    }
  
    private extractTokenFromHeader(request: Request): string | undefined {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    }
  }