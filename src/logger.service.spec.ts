import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  let loggerService: LoggerService;
  beforeEach(() => {
    loggerService = new LoggerService();
  });

  it('should call the debug method with the correct arguments', () => {
    const spy = jest.spyOn(loggerService, 'debug');
    const message = 'Test message';
    loggerService.debug(message);
    expect(spy).toHaveBeenCalledWith(message);
  });
});
