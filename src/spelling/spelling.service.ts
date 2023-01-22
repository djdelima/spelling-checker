import { Inject, Injectable } from '@nestjs/common';

import {
  GrammarBotResponse,
  IGrammarBotClient,
  Match,
} from './clients/grammar-bot-client';
import { Issue, SpellValidation } from './spelling.types';
import { LoggerService } from '../logger.service';

@Injectable()
export class SpellingService {
  constructor(
    @Inject('IGrammarBotClient') readonly grammarBotClient: IGrammarBotClient,
    private readonly logger: LoggerService,
  ) {}

  async checkSpelling(text: string): Promise<SpellValidation> {
    this.logger.debug(`Checking spelling for text: ${text}`);
    const response = await this.grammarBotClient.checkGrammar(text);

    const grammarBotResponse: GrammarBotResponse = JSON.parse(
      response.body,
    ) as GrammarBotResponse;

    this.logger.debug(
      `GrammarBot response: ${JSON.stringify(grammarBotResponse)}`,
    );

    const issues: Array<Issue> = grammarBotResponse.matches.map(
      (issue: Match) => {
        return {
          type: issue.rule.category.name,
          match: {
            surface: issue.context.text,
            beginOffset: issue.offset,
            endOffset: issue.offset + issue.length,
            replacement: issue.replacements.map(
              (replacement) => replacement.value,
            ),
          },
        };
      },
    );

    const spellValidation: SpellValidation = {
      id: 'unique-identifier',
      info: {
        words: text.split(' ').length,
        time: new Date().toString(),
      },
      issues,
    };

    this.logger.debug(`Spell validation: ${JSON.stringify(spellValidation)}`);
    return spellValidation;
  }
}
