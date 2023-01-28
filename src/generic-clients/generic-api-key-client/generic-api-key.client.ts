import { Got } from 'got';

import { IGenericApiKeyClient, IGenericApiKeyClientConfig } from './interfaces';
import { GenericAuthClient } from '~/generic-clients';
import { IRequestService } from '~/request-service';

export abstract class GenericApiKeyClient
  extends GenericAuthClient
  implements IGenericApiKeyClient
{
  protected gotInstanceWithAuth!: Got;

  constructor(
    protected override readonly requestService: IRequestService,
    protected override readonly config: IGenericApiKeyClientConfig,
  ) {
    super(config, requestService);
  }

  async getGotInstanceWithAuth(): Promise<Got> {
    if (!this.gotInstanceWithAuth) {
      const apiKey = this.config.apiKey;
      this.gotInstanceWithAuth = (await this.getGotInstance()).extend({
        headers: { 'X-RapidAPI-Key': apiKey },
      });
    }

    return this.gotInstanceWithAuth;
  }
}
