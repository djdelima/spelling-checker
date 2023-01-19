import { Module } from '@nestjs/common';
import { SpellingService } from './spelling.service';
import { GrammarBotClient } from './clients/grammar-bot-client/grammar-bot.client';
import { SpellingController } from './spelling.controller';
// import { SpellingTestService } from './spelling.test.service';

@Module({
  controllers: [SpellingController],
  // providers: [SpellingTestService],
  // exports: [SpellingTestService],
  providers: [
    SpellingService,
    { provide: 'IGrammarBotClient', useClass: GrammarBotClient },
  ],
  exports: [
    SpellingService,
    { provide: 'IGrammarBotClient', useClass: GrammarBotClient },
  ],
})
export class SpellingModule {}
