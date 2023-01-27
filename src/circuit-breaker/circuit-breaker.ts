import CircuitBreaker, { Options } from 'opossum';
import { LoggerService } from 'logger.service';
import { GrammarBotError } from '../errors/grammar-bot.error';

export const createCircuitBreaker = (func: any, logger: LoggerService) => {
  const options: Options = {
    timeout: 10000,
    errorThresholdPercentage: 50,
    volumeThreshold: 10,
    errorFilter: (err) =>
      !err || !err.statusCode ? false : err.statusCode >= 300,
  };
  const breaker = new CircuitBreaker(func, options);
  breaker.on('timeout', () => {
    logger.log('TIMEOUT: is taking too long to respond.');
  });
  breaker.on('open', () => {
    logger.log('OPEN: The breaker just opened.');
  });
  breaker.on('halfOpen', () => {
    logger.log('HALF_OPEN: The breaker is half open.');
  });
  breaker.on('close', () => {
    logger.log('CLOSE: The breaker has closed. Service OK.');
  });
  breaker.on('fallback', (err: any) => {
    logger.error(`Circuit breaker fallback: ${err.message}`);
    if (err.code && err.code === 'EOPENBREAKER') {
      throw new GrammarBotError(500, 'Circuit Breaker opened');
    }
    throw err;
  });
  return breaker;
};
