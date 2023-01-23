import {
  NestInterceptor,
  ExecutionContext,
  Injectable,
  CallHandler, HttpException,
} from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';
import { GrammarBotError } from '../errors/grammar-bot.error';

@Injectable()
export class GlobalErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, call$: CallHandler): Observable<any> {
    return call$.handle().pipe(
      catchError((error: Error) => {
        // handle the error based on its httpCode property
        if (error instanceof GrammarBotError) {
          throw new HttpException(JSON.stringify(error), error.httpCode);
        }
        return throwError(error);
      }),
    );
  }
}
