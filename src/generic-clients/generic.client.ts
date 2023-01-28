import {
  Got,
  HTTPAlias,
  OptionsOfJSONResponseBody,
  RequiredRetryOptions,
  Response,
} from 'got';
import { Delays } from 'got/dist/source/core/utils/timed-out';

import {
  GotInstanceInitializationError,
  IGenericClient,
  IGenericClientConfig,
} from '.';
import { IRequestService } from '~/request-service';

export abstract class GenericClient implements IGenericClient {
  protected abstract name: string;
  private gotInstance!: Got;

  protected constructor(
    protected readonly config: IGenericClientConfig,
    protected readonly requestService: IRequestService,
  ) {}

  async call<T>(
    method: HTTPAlias,
    url: string,
    options: OptionsOfJSONResponseBody,
  ): Promise<Response<T>> {
    try {
      const instance = await this.getGotInstance();
      return instance[method]<T>(url, options);
    } catch (error) {
      throw new GotInstanceInitializationError(error as Error);
    }
  }

  getName(): string {
    return this.name;
  }

  async getGotInstance(): Promise<Got> {
    if (!this.gotInstance) {
      this.gotInstance = this.requestService.getInstance({
        prefixUrl: this.config.endpoint,
        responseType: 'json',
        throwHttpErrors: false,
        timeout: this.getTimeoutConfig(),
        retry: this.getRetryConfig(),
      });
    }

    return this.gotInstance;
  }

  protected getTimeoutConfig(): Delays | number {
    return {
      connect: 500,
      request: 2000,
      response: 1000,
    };
  }

  protected getRetryConfig():
    | undefined
    | Partial<RequiredRetryOptions>
    | number {
    return {
      calculateDelay: ({ computedValue }) => computedValue / 5,
      limit: 1,
    };
  }
}
