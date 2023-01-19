import { Response } from 'got';

export interface IGrammarBotClient {
  checkGrammar(text: string, language?: string): Promise<Response<string>>;
}
