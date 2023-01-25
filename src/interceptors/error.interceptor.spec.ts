import { Test } from '@nestjs/testing';
import { GrammarBotError } from '../errors/grammar-bot.error';
import { HttpException } from '@nestjs/common';
import { GlobalErrorInterceptor } from '../interceptors/error.interceptor';
import { throwError } from 'rxjs';

describe('GlobalErrorInterceptor', () => {
  let interceptor: GlobalErrorInterceptor;
  let handleMock: jest.Mock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [GlobalErrorInterceptor],
    }).compile();

    interceptor = module.get<GlobalErrorInterceptor>(GlobalErrorInterceptor);
    handleMock = jest.fn();
  });

  it('should catch errors and throw HttpExceptions', () => {
    const error = new GrammarBotError(400, 'GrammarBot error');
    handleMock.mockReturnValue(throwError(error));

    interceptor.intercept({} as any, { handle: handleMock } as any);

    expect(handleMock).toHaveBeenCalled();
    expect(() => {
      throw new HttpException(error.message, error.httpCode);
    }).toThrow(HttpException);
    expect(() => {
      throw new HttpException(error.message, error.httpCode);
    }).toThrow(error.message);
  });

  it('should not catch other errors', () => {
    const error = new Error('Other error');
    handleMock.mockReturnValue(throwError(error));

    interceptor.intercept({} as any, { handle: handleMock } as any);

    expect(handleMock).toHaveBeenCalled();
    expect(() => {
      throw error;
    }).toThrow(Error);
    expect(() => {
      throw error;
    }).toThrow(error.message);
  });
});
