import { Module } from '@nestjs/common';
import { SpellingService } from './spelling.service';
import { GrammarBotClient } from './clients/grammar-bot-client/grammar-bot.client';
import { SpellingController } from './spelling.controller';
import { LoggerService } from '../logger.service';

@Module({
  controllers: [SpellingController],
  providers: [
    LoggerService,
    SpellingService,
    { provide: 'IGrammarBotClient', useClass: GrammarBotClient },
  ],
  exports: [
    LoggerService,
    SpellingService,
    { provide: 'IGrammarBotClient', useClass: GrammarBotClient },
  ],
})
export class SpellingModule {}
