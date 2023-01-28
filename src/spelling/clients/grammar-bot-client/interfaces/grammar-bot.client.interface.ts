import { GrammarBotResponseDTO } from 'spelling/clients';
import { IGenericApiKeyClient } from '~/generic-clients';
import { Response } from 'got';

export interface IGrammarBotClient extends IGenericApiKeyClient {
  checkGrammar(
    text: string,
    language?: string,
  ): Promise<Response<GrammarBotResponseDTO>>;
}
