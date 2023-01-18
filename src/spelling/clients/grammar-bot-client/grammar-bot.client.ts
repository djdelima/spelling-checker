import got from 'got';
import { Options, Response } from 'got';
import { IGrammarBotClient } from './interfaces';
import { GrammarBotResponse } from './types';
import { envConfig } from '../../../env.config';

export class GrammarBotClient implements IGrammarBotClient {
  async checkGrammar(
    text: string,
    language = 'en-US',
  ): Promise<Response<GrammarBotResponse>> {
    try {
      const encodedParams = new URLSearchParams();
      encodedParams.append('text', text);
      encodedParams.append('language', language);

      const options: Options = {
        method: 'POST',
        url: 'https://grammarbot.p.rapidapi.com/check',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'X-RapidAPI-Key': envConfig.apiKey,
          'X-RapidAPI-Host': 'grammarbot.p.rapidapi.com',
        },
        body: encodedParams.toString(),
      };

      return (await got(
        'https://grammarbot.p.rapidapi.com/check',
        options,
      )) as Response<GrammarBotResponse>;
    } catch (error) {
      throw new Error(`Error checking grammar: ${(error as Error).message}`);
    }
  }
}
