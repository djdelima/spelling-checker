import { Injectable } from '@nestjs/common';
import { Logger as LoggerWin } from 'winston';
import * as winston from 'winston';

@Injectable()
export class LoggerService {
  private readonly logger: LoggerWin;
  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.json(),
      defaultMeta: { service: 'spelling-checker' },
      transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
      ],
    });
  }

  error(message: string) {
    this.logger.error(message);
  }

  log(message: string) {
    this.logger.info(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }
}
