import { Injectable } from '@nestjs/common';
import { Logger as LoggerWin } from 'winston';
import * as winston from 'winston';

@Injectable()
export class LoggerService {
  private readonly logger: LoggerWin;
  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.align(),
        winston.format.printf(
          (info) =>
            `[${info.level.toUpperCase()}] ${info.timestamp} ${info.message}`,
        ),
      ),
      transports: [new winston.transports.Console()],
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
