import { Module } from '@nestjs/common';
import { SpellingModule } from './spelling';

@Module({
  imports: [SpellingModule],
})
export class AppModule {}
