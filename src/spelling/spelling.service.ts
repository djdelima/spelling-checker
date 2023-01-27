import { Inject, Injectable } from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid';
import {
  GrammarBotResponseDTO,
  IGrammarBotClient,
  MatchDTO,
} from './clients/grammar-bot-client';
import { Issue, SpellValidation } from './spelling.types';
import { LoggerService } from '../logger.service';
import CircuitBreaker from 'opossum';
import { createCircuitBreaker } from '../circuit-breaker/circuit-breaker';

@Injectable()
export class SpellingService {
  private breaker: CircuitBreaker;

  constructor(
    @Inject(LoggerService) readonly logger: LoggerService,
    @Inject('IGrammarBotClient') readonly grammarBotClient: IGrammarBotClient,
  ) {
    this.breaker = createCircuitBreaker(
      this.grammarBotClient.checkGrammar,
      this.logger,
    );
  }

  async checkSpelling(text: string): Promise<SpellValidation> {
    this.logger.debug(`Checking spelling for text: ${text}`);
    const grammarBotResponse = (await this.breaker.fire(
      text,
    )) as GrammarBotResponseDTO;

    this.logger.log(
      `GrammarBot response: ${JSON.stringify(grammarBotResponse)}`,
    );

    this.logger.log(
      `GrammarBot response: ${JSON.stringify(grammarBotResponse)}`,
    );

    // Extract issues from grammarBotResponse
    const issues: Array<Issue> = grammarBotResponse.matches.map(
      (issue: MatchDTO) => {
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
