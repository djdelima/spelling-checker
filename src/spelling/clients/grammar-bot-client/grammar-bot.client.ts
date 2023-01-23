import got from 'got';
import { IGrammarBotClient } from './interfaces';
import { envConfig } from '../../../env.config';
import { Inject, Injectable } from '@nestjs/common';
import { LoggerService } from '../../../logger.service';
import { statusCodeErrors } from '../../spelling.types';
import { GrammarBotError } from '../../../errors/grammar-bot.error';
import { plainToClass } from 'class-transformer';
import { GrammarBotResponseDTO } from './types';

@Injectable()
export class GrammarBotClient implements IGrammarBotClient {
  constructor(@Inject(LoggerService) private readonly logger: LoggerService) {}

  async checkGrammar(
    text: string,
    language = 'en-US',
  ): Promise<GrammarBotResponseDTO> {
    try {
      this.logger.debug(`Checking grammar for text: ${text}`);
      const encodedParams = new URLSearchParams();
      encodedParams.append('text', text);
      encodedParams.append('language', language);

      const response = await got.post(
        `https://grammarbot.p.rapidapi.com/check?text=${text}&language=${language}`,
        {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'X-RapidAPI-Key': envConfig.apiKey,
            'X-RapidAPI-Host': 'grammarbot.p.rapidapi.com',
          },
        },
      );

      if (response.statusCode >= 400) {
        const errorMessage =
          statusCodeErrors[response.statusCode] ||
          `Error checking grammar: Unexpected error with status code ${response.statusCode}`;
        this.logger.error(`Error checking grammar: ${errorMessage}`);
        throw new GrammarBotError(response.statusCode, errorMessage);
      }

      this.logger.debug(`Received response from GrammarBot API: ${response}`);
      return plainToClass(GrammarBotResponseDTO, JSON.parse(response.body));
    } catch (error) {
      if (error instanceof got.HTTPError) {
        const errorMessage =
          statusCodeErrors[error.response.statusCode] ||
          `Error checking grammar: Unexpected error with status code ${error.response.statusCode}`;
        this.logger.error(`Error checking grammar: ${errorMessage}`);
        throw new GrammarBotError(error.response.statusCode, errorMessage);
      }
      this.logger.error(`Error checking grammar: ${(error as Error).message}`);
      throw new Error(`Error checking grammar: ${(error as Error).message}`);
    }
  }
}
