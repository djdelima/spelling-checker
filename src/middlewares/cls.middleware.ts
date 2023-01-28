import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ClsService } from '../cls.service';

@Injectable()
export class ClsMiddleware implements NestMiddleware {
  constructor(@Inject(ClsService) readonly clsService: ClsService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // req and res are event emitters. We want to access CLS context inside their event callbacks
    this.clsService.bindEmitter(req);
    this.clsService.bindEmitter(res);

    this.clsService.run(() => {
      next();
    });
  }
}
