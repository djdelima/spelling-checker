import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  GrammarBotResponse,
  IGrammarBotClient,
  Match,
} from './clients/grammar-bot-client';
import { Issue, SpellValidation } from './spelling.types';

@Injectable()
export class SpellingService {
  constructor(
    @Inject('IGrammarBotClient') readonly grammarBotClient: IGrammarBotClient,
  ) {}

  async checkSpelling(text: string): Promise<SpellValidation> {
    const response = await this.grammarBotClient.checkGrammar(text);
    const grammarBotResponse: GrammarBotResponse = JSON.parse(
      response.body,
    ) as GrammarBotResponse;

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

    return spellValidation;
  }
}
