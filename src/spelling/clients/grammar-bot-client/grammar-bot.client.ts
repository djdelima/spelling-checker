import { Response } from 'got';

import { IGrammarBotClient } from './interfaces';
import { Inject, Injectable } from '@nestjs/common';
import { GrammarBotResponseDTO } from './types';
import { GenericApiKeyClient } from '~/generic-clients';
import { IRequestService } from '~/request-service';
import { GrammarBotClientConfig } from '~/spelling/clients/grammar-bot-client/configs';

@Injectable()
export class GrammarBotClient
  extends GenericApiKeyClient
  implements IGrammarBotClient
{
  protected readonly name = 'grammar-bot';

  constructor(
    @Inject('IRequestService') readonly requestService: IRequestService,
    protected override readonly config: GrammarBotClientConfig,
  ) {
    super(requestService, config);
  }

  async checkGrammar(
    text: string,
    language = 'en-US',
  ): Promise<Response<GrammarBotResponseDTO>> {
    const encodedParams = new URLSearchParams();
    encodedParams.append('text', text);
    encodedParams.append('language', language);

    return this.callWithAuth<GrammarBotResponseDTO>('post', 'check', {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'X-RapidAPI-Host': 'grammarbot.p.rapidapi.com',
      },
      searchParams: { text, language },
      context: {},
    });
  }
}
