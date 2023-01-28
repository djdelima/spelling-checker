import { Module } from '@nestjs/common';
import { SpellingModule } from './spelling/spelling.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalErrorInterceptor } from '~/interceptors/error.interceptor';
import { ClsService } from '~/cls.service';

@Module({
  imports: [SpellingModule],
  providers: [
    ClsService,
    {
      provide: APP_INTERCEPTOR,
      useClass: GlobalErrorInterceptor,
    },
  ],
})
export class AppModule {}
