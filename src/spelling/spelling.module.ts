import { Module } from '@nestjs/common';
import { SpellingService } from './spelling.service';
import { GrammarBotClient } from './clients/grammar-bot-client/grammar-bot.client';
import { SpellingController } from './spelling.controller';

@Module({
  controllers: [SpellingController],
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
