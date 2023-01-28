import {
  IStandardError,
  StandardErrorCauses,
  StandardErrorDetails,
} from './standard-error';

type ConstructorParams = IStandardError & {
  err?: Error;
};

export class AppError extends Error implements IStandardError {
  public readonly code: string;
  public readonly details?: StandardErrorDetails;
  public readonly causes?: StandardErrorCauses;
  public readonly timestamp?: string;

  constructor({
    code = 'AppError',
    message = 'General application error',
    details,
    causes,
    err,
  }: ConstructorParams) {
    super(message);

    this.timestamp = new Date().toISOString();

    Object.setPrototypeOf(this, new.target.prototype);

    Error.captureStackTrace(this, this.constructor);

    this.code = code;
    this.message = message;
    this.details = details;
    this.causes = causes;

    if (err) {
      this.stack = err.stack;
    }
  }

  toJSON(): Record<string, any> {
    const payload: Record<string, any> = {
      code: this.code,
      message: this.message,
      timestamp: this.timestamp,
    };

    if (this.details) {
      payload.details = this.details;
    }

    if (this.causes && this.causes.length) {
      payload.causes = this.causes.map((cause) => {
        if (cause instanceof AppError) {
          return cause.toJSON();
        }
        return cause;
      });
    }

    return payload;
  }
}
