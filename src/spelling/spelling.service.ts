import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
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

    // Extract issues from grammarBotResponse
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

    // Extract words count and time
    const wordsCount = text.split(' ').length;
    const time = new Date().toString();

    // create spellValidation
    const spellValidation = {
      id: uuidv4(),
      info: {
        words: wordsCount,
        time: time,
      },
      issues,
    };

    this.logger.debug(`Spell validation: ${JSON.stringify(spellValidation)}`);
    return spellValidation;
  }
}
