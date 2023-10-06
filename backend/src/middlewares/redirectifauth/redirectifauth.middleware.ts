import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class RedirectIfAuthMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    if( req.user == undefined ){ next(); }
    res.status(HttpStatus.MOVED_PERMANENTLY);
  }
}
