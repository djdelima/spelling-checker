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
        // handle the error based on Error instance
        if (error instanceof GrammarBotError) {
          throw new HttpException(error.message, error.httpCode);
        }
        return throwError(error);
      }),
    );
  }
}
