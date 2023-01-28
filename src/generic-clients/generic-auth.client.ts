import { Got, HTTPAlias, OptionsOfJSONResponseBody, Response } from 'got';

import {
  GenericClient,
  GotInstanceInitializationError,
  IGenericAuthClient,
  IGenericClientConfig,
} from '.';
import { IRequestService } from '~/request-service';

export abstract class GenericAuthClient
  extends GenericClient
  implements IGenericAuthClient
{
  protected abstract gotInstanceWithAuth: Got;

  protected constructor(
    config: IGenericClientConfig,
    requestService: IRequestService,
  ) {
    super(config, requestService);
  }

  abstract getGotInstanceWithAuth(): Promise<Got>;

  async callWithAuth<T>(
    method: HTTPAlias,
    url: string,
    options: OptionsOfJSONResponseBody,
  ): Promise<Response<T>> {
    try {
      const instance = await this.getGotInstanceWithAuth();
      return instance[method]<T>(url, options);
    } catch (error) {
      throw new GotInstanceInitializationError(error as Error);
    }
  }
}
