import { AppError } from './app-error';
import { IStandardError } from './standard-error';

type ConstructorParams = IStandardError & {
  statusCode: number;
  err?: Error;
};

export class HttpError extends AppError {
  public readonly statusCode: number;

  constructor({
    statusCode = 500,
    code = 'HttpError',
    message = 'Something went wrong',
    details,
    causes,
    err,
  }: ConstructorParams) {
    super({ code, message, details, causes, err });

    this.statusCode = statusCode;
  }

  static fromStandardError(
    statusCode: number,
    error: IStandardError | AppError,
  ): HttpError {
    const httpError = new HttpError({
      statusCode,
      code: error.code,
      message: error.message,
      details: error.details,
      causes: error.causes,
      err: error instanceof Error ? error : undefined,
    });

    if ((error as AppError).stack) {
      httpError.stack = (error as AppError).stack;
    }

    return httpError;
  }
}
