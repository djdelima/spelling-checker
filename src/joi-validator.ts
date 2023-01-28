import { Schema, ValidationError, ValidationErrorItem } from '@hapi/joi';

import { ValidatedConfig } from './env';
import { StandardValidationError } from '~/errors/standard-validation-error';

export const standardizeJoiValidationError = (
  error: ValidationError | ValidationErrorItem,
): StandardValidationError => {
  if (error instanceof ValidationError) {
    return new StandardValidationError(
      `Provided data is not valid: ${error.message}`,
      {},
      error.details.map(standardizeJoiValidationError),
    );
  }

  return new StandardValidationError(error.message, {
    property: (error as ValidationErrorItem).context?.key,
    constraint: (error as ValidationErrorItem).type,
  });
};

export const validateDataByJoi = (
  schema: Schema,
  data: Record<string, any>,
): ValidatedConfig => {
  const { error, value: validatedConfig } = schema.validate(data, {
    allowUnknown: true,
    abortEarly: false,
  });

  if (error) {
    throw standardizeJoiValidationError(error);
  }

  return validatedConfig;
};
