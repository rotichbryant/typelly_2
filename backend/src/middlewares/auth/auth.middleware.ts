import { Injectable, NestMiddleware, Req } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(@Req() req: Request, res: any, next: () => void) {
    next();
  }
}
