import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import os from 'os';

import { AppModule } from './app.module';
import { envConfig } from './env.config';
import { ClsService } from '~/cls.service';
import { CORRELATION_ID_CLS_KEY } from '~/types/correlation-id.cls-key';
import { LoggerService } from '~/logger.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  });

  const server = app.getHttpAdapter().getHttpServer();
  server.keepAliveTimeout = 65000;
  server.headersTimeout = 66000;

  const clsService: ClsService = app.get('ClsService');

  clsService.run(async () => {
    clsService.set(CORRELATION_ID_CLS_KEY, `bootstrap-${os.hostname()}`);

    const loggerService: LoggerService = app.get('LoggerService');

    app.disable('etag').disable('x-powered-by');
    // app.useGlobalFilters(new ExceptionsFilter(loggerService));
    // app.use(rawBodyMiddleware);
    // app.useGlobalPipes(createGlobalValidationPipe());

    loggerService
      .getLogger()
      .info(`Starting application listening on ${envConfig.appPort}`);

    await app.listen(envConfig.appPort);
  });
}
bootstrap();
