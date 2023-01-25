import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ClsService } from '../cls.service';
import { CORRELATION_ID_CLS_KEY } from '../types/correlation-id.cls-key';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  constructor(private readonly clsService: ClsService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const xcid = req.header('x-correlation-id') || uuidv4();

    this.clsService.set(CORRELATION_ID_CLS_KEY, xcid);

    res.setHeader('x-correlation-id', xcid);
    next();
  }
}
