import { Response } from 'got';
import { GrammarBotResponse } from '~/spelling/clients';

export interface IGrammarBotClient {
  checkGrammar(text: string, language?: string): Promise<GrammarBotResponse>;
}
