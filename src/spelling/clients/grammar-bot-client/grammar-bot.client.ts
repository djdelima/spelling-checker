import got from 'got';
import { Options, Response } from 'got';
import { IGrammarBotClient } from './interfaces';
import { envConfig } from '../../../env.config';
import { Inject, Injectable } from '@nestjs/common';
import { LoggerService } from '../../../logger.service';
import { statusCodeErrors } from '../../spelling.types';
import { GrammarBotError } from '../../../errors/grammar-bot.error';
import { GrammarBotResponse } from '~/spelling/clients';

@Injectable()
export class GrammarBotClient implements IGrammarBotClient {
  constructor(@Inject(LoggerService) private readonly logger: LoggerService) {}

  async checkGrammar(
    text: string,
    language = 'en-US',
  ): Promise<GrammarBotResponse> {
    try {
      this.logger.debug(`Checking grammar for text: ${text}`);
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

      this.logger.debug(
        `Sending request to GrammarBot API with options: ${options}`,
      );
      const response = (await got(options)) as Response;

      if (response.statusCode >= 400) {
        const errorMessage =
          statusCodeErrors[response.statusCode] ||
          `Error checking grammar: Unexpected error with status code ${response.statusCode}`;
        this.logger.error(`Error checking grammar: ${errorMessage}`);
        throw new GrammarBotError(response.statusCode, errorMessage);
      }

      this.logger.debug(`Received response from GrammarBot API: ${response}`);
      return JSON.parse(<string>response.body) as GrammarBotResponse;
    } catch (error) {
      this.logger.error(`Error checking grammar: ${(error as Error).message}`);
      throw new Error(`Error checking grammar: ${(error as Error).message}`);
    }
  }
}
