import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  GrammarBotResponseDTO,
  IGrammarBotClient,
  MatchDTO,
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
    const grammarBotResponse: GrammarBotResponseDTO =
      await this.grammarBotClient.checkGrammar(text);

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
