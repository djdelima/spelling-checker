import { createCircuitBreaker } from './circuit-breaker';
import { LoggerService } from '../logger.service';
import CircuitBreaker, { Options } from 'opossum';
import { GrammarBotError } from '../errors/grammar-bot.error';

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
    const error = { code: 'EOPENBREAKER', message: 'error message' };
    expect(() => breaker.emit('fallback', error)).toThrow(GrammarBotError);
    expect(logger.error).toHaveBeenCalledWith(
      'Circuit breaker fallback: error message',
    );
  });
});
