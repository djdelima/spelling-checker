import { getOrDefault, getOrThrow } from './env.config';

describe('Env Config', () => {
  const testEnvVar = {
    key: 'SOME_RANDOM_ENV_VAR',
    value: 'some-value',
  };

  beforeAll(() => {
    process.env[testEnvVar.key] = testEnvVar.value;
  });

  afterAll(() => {
    delete process.env[testEnvVar.key];
  });

  describe('getOrThrow', () => {
    it('should return value of env variable', () => {
      expect(getOrThrow(testEnvVar.key)).toEqual(testEnvVar.value);
    });

    it('should throw error if env variable does not exist', () => {
      expect.assertions(1);
      expect(() => {
        getOrThrow(`${testEnvVar.key}_123456`);
      }).toThrowError();
    });
  });

  describe('getOrDefault', () => {
    it('should return value of env variable', () => {
      expect(getOrDefault(testEnvVar.key, 'some-default-value')).toEqual(
        testEnvVar.value,
      );
    });

    it('should return default value if env variable does not exist', () => {
      expect(
        getOrDefault(`${testEnvVar.key}_09231`, 'some-default-value'),
      ).toEqual('some-default-value');
    });
  });
});
