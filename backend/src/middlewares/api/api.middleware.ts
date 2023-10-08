import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { keys } from 'lodash';

@Injectable()
export default class ApiMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const { headers } = req;
    if( 
        keys(headers).includes('X-Requested-With') || 
        keys(headers).includes('x-requested-with') || 
        ( keys(headers).includes('content-type') && (headers['content-type'].includes('application/json') || headers['content-type'].includes('text/event-stream')) ) ||
        headers['accept'].includes('text/event-stream')

     ){ 
      next()
    } else { 
      throw new HttpException('Not Acceptable',HttpStatus.NOT_ACCEPTABLE);
    }
  }
}
