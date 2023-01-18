import { name, version } from '../package.json';

export const getOrThrow = (envVar: string): string => {
  const value = process.env[envVar];

  if (value === undefined) {
    throw new Error(`Environment variable "${envVar}" is not defined`);
  }

  return value;
};

export const getOrDefault = (envVar: string, defaultValue: string) => {
  return process.env[envVar] || defaultValue;
};

export const envConfig = {
  appName: name,
  appTag: version,
  get apiKey(): string {
    return getOrThrow('API_KEY');
  },
  get env() {
    return getOrThrow('ENV');
  },
  get appPort() {
    return getOrDefault('APP_PORT', '3000');
  },
};
