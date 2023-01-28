import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { IGrammarBotClient, MatchDTO } from './clients/grammar-bot-client';
import { Issue, SpellValidation } from './spelling.types';
import { response } from 'express';
import { UnexpectedUpstreamResponseError } from '~/errors/unexpected-upstream-response.error';

@Injectable()
export class SpellingService {
  readonly name = 'spelling-service';

  constructor(
    @Inject('IGrammarBotClient') readonly grammarBotClient: IGrammarBotClient,
  ) {}

  async checkSpelling(text: string): Promise<SpellValidation> {
    const grammarBotResponse = await this.grammarBotClient.checkGrammar(text);

    if (response.statusCode == 200) {
      // Extract issues from grammarBotResponse
      const issues: Array<Issue> = grammarBotResponse.body.matches.map(
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

      return spellValidation;
    }

    throw new UnexpectedUpstreamResponseError(
      this.name,
      grammarBotResponse.statusCode,
      grammarBotResponse.body,
    );
  }
}
