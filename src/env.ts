import { Schema } from '@hapi/joi';

import { validateDataByJoi } from './joi-validator';

export type Env = 'dev' | 'stage' | 'prod';

export type ValidatedConfig = Record<string, any>;

export enum CIEnvironment {
  LOCAL = 'local',
  GHA = 'gha',
}

export enum EnvironmentVariableNames {
  LOG_LEVEL = 'LOG_LEVEL',
  CI = 'CI',

  // GHA
  GITHUB_ACTIONS = 'GITHUB_ACTIONS',
  GITHUB_SHA = 'GITHUB_SHA',
  GITHUB_REF = 'GITHUB_REF',
}

export class CurrentCIEnvironment {
  get isCi(): boolean {
    const ciValue = process.env[EnvironmentVariableNames.CI];
    return ![undefined, 'false'].includes(ciValue);
  }

  get isGitHubActions(): boolean {
    return process.env[EnvironmentVariableNames.GITHUB_ACTIONS] === 'true';
  }

  getCurrentCIEnvironment(): CIEnvironment {
    if (this.isCi) {
      if (this.isGitHubActions) {
        return CIEnvironment.GHA;
      } else {
        throw new Error('Could not define environment type.');
      }
    } else {
      return CIEnvironment.LOCAL;
    }
  }
}

export const validateEnvironmentVariables = (
  schema: Schema,
): ValidatedConfig => {
  return validateDataByJoi(schema, process.env);
};

export const getOrThrow = (envVar: string): string => {
  const value = process.env[envVar];

  if (value === undefined) {
    throw new Error(`Environment variable "${envVar}" is not defined`);
  }

  return value;
};

export const getOrDefault = (envVar: string, defaultValue: string): string => {
  return process.env[envVar] || defaultValue;
};
