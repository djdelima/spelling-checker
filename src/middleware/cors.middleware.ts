import { NestMiddleware, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    res.header(
      'Access-Control-Allow-Origin',
      'https://spelling-checker-front.herokuapp.com',
    );
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept',
    );
    res.header(
      'Access-Control-Allow-Methods',
      'GET,HEAD,PUT,PATCH,POST,DELETE',
    );
    next();
  }
}
