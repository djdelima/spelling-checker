import { AppError } from './app-error';
import { IStandardError } from './standard-error';

export class StandardValidationError extends AppError {
  constructor(
    message: string,
    details?: Record<string, any>,
    causes?: IStandardError[],
  ) {
    super({
      code: 'StandardValidationError',
      message,
      details,
      causes,
    });
  }
}
