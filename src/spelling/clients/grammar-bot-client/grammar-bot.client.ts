import got from 'got';
import { Options, Response } from 'got';
import { IGrammarBotClient } from './interfaces';
import { envConfig } from '../../../env.config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GrammarBotClient implements IGrammarBotClient {
  async checkGrammar(
    text: string,
    language = 'en-US',
  ): Promise<Response<string>> {
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

      const response = (await got(options)) as Response<string>;

      return response;
    } catch (error) {
      throw new Error(`Error checking grammar: ${(error as Error).message}`);
    }
  }
}
