import Joi from '@hapi/joi';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigFactory } from '@nestjs/config/dist/interfaces';
import { IGenericApiKeyClientConfig } from '../../../../generic-clients';
import { createConfigFactory } from '~/utils';

@Injectable()
export class GrammarBotClientConfig implements IGenericApiKeyClientConfig {
  static ValidationSchema = Joi.object({
    GRAMMAR_BOT_URI: Joi.string().required(),
    GRAMMAR_BOT_API_KEY: Joi.string().required(),
  });

  static factory: ConfigFactory = createConfigFactory(
    'grammar-bot',
    GrammarBotClientConfig.ValidationSchema,
  );

  constructor(private readonly configService: ConfigService) {}

  get apiKey(): string {
    return this.configService.get('grammar-bot.GRAMMAR_BOT_API_KEY') as string;
  }

  get endpoint(): string {
    return this.configService.get('grammar-bot.GRAMMAR_BOT_URI') as string;
  }
}
