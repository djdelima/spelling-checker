import { createCircuitBreaker } from './circuit-breaker';
import { LoggerService } from 'logger.service';
import CircuitBreaker, { Options } from 'opossum';
import { GrammarBotError } from 'errors/grammar-bot.error';

describe('createCircuitBreaker', () => {
  let logger: LoggerService;
  let func: jest.Mock;
  let breaker: CircuitBreaker;

  beforeEach(() => {
    logger = new LoggerService();
    func = jest.fn();
    breaker = createCircuitBreaker(func, logger);
  });

  it('should log "TIMEOUT: is taking too long to respond." when the timeout event is emitted', () => {
    jest.spyOn(logger, 'log');
    breaker.emit('timeout');
    expect(logger.log).toHaveBeenCalledWith(
      'TIMEOUT: is taking too long to respond.',
    );
  });

  it('should log "OPEN: The breaker just opened." when the open event is emitted', () => {
    jest.spyOn(logger, 'log');
    breaker.emit('open');
    expect(logger.log).toHaveBeenCalledWith('OPEN: The breaker just opened.');
  });

  it('should log "HALF_OPEN: The breaker is half open." when the halfOpen event is emitted', () => {
    jest.spyOn(logger, 'log');
    breaker.emit('halfOpen');
    expect(logger.log).toHaveBeenCalledWith(
      'HALF_OPEN: The breaker is half open.',
    );
  });

  it('should log "CLOSE: The breaker has closed. Service OK." when the close event is emitted', () => {
    jest.spyOn(logger, 'log');
    breaker.emit('close');
    expect(logger.log).toHaveBeenCalledWith(
      'CLOSE: The breaker has closed. Service OK.',
    );
  });

  it('should log "Circuit breaker fallback: error message" and throw a GrammarBotError when the fallback event is emitted with code EOPENBREAKER', () => {
    jest.spyOn(logger, 'error');
    const error = new Error('error message');
    error.code = 'EOPENBREAKER';
    expect(() => breaker.emit('fallback', error)).toThrow(GrammarBotError);
    expect(logger.error).toHaveBeenCalledWith(
      'Circuit breaker fallback: error message',
    );
  });

  it('should log "Circuit breaker fallback: error message" and throw the error when the fallback event is emitted with a different code', () => {
    jest.spyOn(logger, 'error');
    const error = new Error('Some error');
    error.code = 'SomeCode';
    breaker.fallback(error);
    expect(logger.error).toHaveBeenCalledWith(
      'Circuit breaker fallback: Some error',
    );
    expect(() => {
      breaker.fallback(error);
    }).toThrowError(error);
  });

  it('should log "Circuit breaker fallback: error message" and throw GrammarBotError with status code 500 when the fallback event is emitted with code EOPENBREAKER', () => {
    jest.spyOn(logger, 'error');
    const error = new Error('Some error');
    error.code = 'EOPENBREAKER';
    breaker.fallback(error);
    expect(logger.error).toHaveBeenCalledWith(
      'Circuit breaker fallback: Some error',
    );
    expect(() => {
      breaker.fallback(error);
    }).toThrowError(new GrammarBotError(500, 'Circuit Breaker opened'));
  });
});
