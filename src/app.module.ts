import { Module } from '@nestjs/common';
import { SpellingModule } from './spelling/spelling.module';

@Module({
  imports: [SpellingModule],
})
export class AppModule {}
