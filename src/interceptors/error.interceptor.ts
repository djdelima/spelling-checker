import {
  NestInterceptor,
  ExecutionContext,
  Injectable,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';
import { UnexpectedUpstreamResponseError } from '~/errors/unexpected-upstream-response.error';

@Injectable()
export class GlobalErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, call$: CallHandler): Observable<any> {
    return call$.handle().pipe(
      catchError((error: Error) => {
        // handle the error based on Error instance
        if (error instanceof UnexpectedUpstreamResponseError) {
          throw new HttpException(
            error.message,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
        return throwError(error);
      }),
    );
  }
}
