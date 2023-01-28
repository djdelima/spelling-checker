import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { SpellingService } from './spelling.service';
import { GrammarBotClient } from './clients/grammar-bot-client/grammar-bot.client';
import { SpellingController } from './spelling.controller';
import { LoggerService } from '../logger.service';
import { CorrelationIdMiddleware } from '~/middlewares/correlation-id.middleware';
import { ConfigModule } from '@nestjs/config';
import { GrammarBotClientConfig } from '~/spelling/clients/grammar-bot-client/configs';
import { RequestService } from '~/request-service';
import {ClsService} from "~/cls.service";
import {ClsMiddleware} from "~/middlewares/cls.middleware";

@Module({
  imports: [ConfigModule.forFeature(GrammarBotClientConfig.factory)],
  controllers: [SpellingController],
  providers: [
    GrammarBotClientConfig,
    { provide: 'IRequestService', useClass: RequestService },
    ClsService,
    LoggerService,
    SpellingService,
    { provide: 'IGrammarBotClient', useClass: GrammarBotClient },
  ],
  exports: [
    { provide: 'IRequestService', useClass: RequestService },
    ClsService,
    LoggerService,
    SpellingService,
    { provide: 'IGrammarBotClient', useClass: GrammarBotClient },
  ],
})
export class SpellingModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(ClsMiddleware, CorrelationIdMiddleware).forRoutes({
      path: '/spell-check',
      method: RequestMethod.ALL,
    });
  }
}
