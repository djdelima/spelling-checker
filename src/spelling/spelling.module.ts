import { Module } from '@nestjs/common';
import { SpellingService } from './spelling.service';

@Module({
  providers: [SpellingService],
  exports: [SpellingService],
})
export class SpellingModule {}
