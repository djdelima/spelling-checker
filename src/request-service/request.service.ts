import HttpAgent, { HttpsAgent } from 'agentkeepalive';
import got, { ExtendOptions, Got } from 'got';

import { LoggerService } from '~/logger.service';
import { IRequestService } from '~/request-service/request.service.interface';
import { Logger } from 'winston';

export class RequestService implements IRequestService {
  private httpAgent: HttpAgent;
  private httpsAgent: HttpsAgent;

  constructor(private readonly logger: LoggerService) {
    this.httpAgent = new HttpAgent({
      keepAlive: true,
      maxSockets: 50,
      maxFreeSockets: 10,
      timeout: 60000, // active socket keepalive for 60 seconds
      freeSocketTimeout: 30000, // free socket keepalive for 30 seconds
    });

    this.httpsAgent = new HttpsAgent({
      keepAlive: true,
      maxSockets: 50,
      maxFreeSockets: 10,
      timeout: 60000, // active socket keepalive for 60 seconds
      freeSocketTimeout: 30000, // free socket keepalive for 30 seconds
    });
  }

  getInstance(...instancesOrOptions: Array<Got | ExtendOptions>): Got {
    const base = got.extend(
      {
        headers: {
          'Content-Type': 'application/json',
        },
        responseType: 'json',
        throwHttpErrors: false,
        timeout: {
          connect: 500,
          response: 1000,
          request: 2000,
        },
        retry: {
          limit: 2,
          calculateDelay: ({ computedValue }) => computedValue / 5,
        },
      },
      this.correlationIdExtension(this.logger.getLogger()),
      this.httpAgentExtension(),
    );

    return base.extend(...instancesOrOptions);
  }

  correlationIdExtension(logger: Logger): Record<string, unknown> {
    return {
      hooks: {
        beforeRequest: [
          (options: ExtendOptions) => {
            if (options.headers) {
              options.headers = {
                ...options.headers,
              };
            }
          },
        ],
      },
    };
  }

  httpAgentExtension(): Record<string, unknown> {
    return {
      agent: {
        http: this.httpAgent,
        https: this.httpsAgent,
      },
    };
  }
}
