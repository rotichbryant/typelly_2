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
  import { AppEntity } from '../entities';
  import { set } from 'lodash';
  
  @Injectable()
  export class ChatBotGuard implements CanActivate {
  
    private readonly appEntity;
    
    constructor(
      private jwtService: JwtService,
      @Inject(DataSource) private readonly dataSource: DataSource    
    ) {
      this.appEntity = this.dataSource.getRepository(AppEntity);
    }
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      if (token == undefined) {
        throw new UnauthorizedException();
      }
      try {
        const { chatbot_app: { hash_key } } = await this.jwtService.verifyAsync(token,{secret: process.env.JWT_SESSION_KEY});
        // 💡 We're assigning the payload to the request object here
        // so that we can access it in our route handlers
        set(request,'chabot_app', await this.appEntity.findOneBy({hash_key}));
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