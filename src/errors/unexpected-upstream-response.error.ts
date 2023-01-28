import { AppError } from '~/errors/app-error';

export class UnexpectedUpstreamResponseError extends AppError {
  constructor(upstream: string, statusCode: number, responseBody: any) {
    super({
      code: 'UnexpectedUpstreamResponseError',
      message: `Unexpected response when communicating to ${upstream}`,
      details: {
        upstream,
        statusCode,
        responseBody,
      },
    });
  }
}
