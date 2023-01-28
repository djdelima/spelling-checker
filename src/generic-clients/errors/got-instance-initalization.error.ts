import { AppError } from '~/errors';

export class GotInstanceInitializationError extends AppError {
  constructor(err: Error) {
    super({
      code: 'GotInstanceInitializationError',
      message: 'Unexpected error happened while initializing got instance',
      details: {
        err,
      },
    });
  }
}
