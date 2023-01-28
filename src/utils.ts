import { Schema } from '@hapi/joi';
import { HttpException, HttpStatus, ValidationError } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { ConfigFactory } from '@nestjs/config/dist/interfaces';
import { validateEnvironmentVariables } from '~/env';
import { AppError } from '~/errors';
import { StandardValidationError } from '~/errors/standard-validation-error';

export const createConfigFactory = (
  namespace: string,
  schema: Schema,
): ConfigFactory =>
  registerAs(namespace, () => validateEnvironmentVariables(schema));

export const standardizeClassValidationError = (
  error: ValidationError,
): AppError => {
  return new StandardValidationError(
    error.toString(),
    {
      property: error.property,
      constraints: error.constraints,
    },
    (error.children as []).map(standardizeClassValidationError),
  );
};

// Use to map error object into it's HTTP status:
export const getStatusCodeForError = (exception: Error): HttpStatus => {
  if (exception instanceof StandardValidationError) {
    return HttpStatus.BAD_REQUEST;
  }

  if (exception instanceof AppError) {
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  if (exception instanceof HttpException) {
    return exception.getStatus();
  }

  return HttpStatus.INTERNAL_SERVER_ERROR;
};

// Use to map error object into it's HTTP status:
export const getResponseBodyForError = (exception: Error): any => {
  if (
    exception instanceof StandardValidationError ||
    exception instanceof AppError
  ) {
    return exception.toJSON();
  }

  if (exception instanceof HttpException) {
    return exception.getResponse();
  }

  return {
    code: 'UnknownServerError',
    message: `Unexpected internal error: ${
      typeof exception === 'object'
        ? exception?.constructor?.name
        : typeof exception
    }`,
  };
};
