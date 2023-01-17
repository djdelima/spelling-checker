import { Injectable } from '@nestjs/common';
import { GrammarBotClient } from './grammar-bot.client';

@Injectable()
export class SpellingService {
  constructor(private readonly grammarBotClient: GrammarBotClient) {}

  async checkGrammar(text: string): Promise<{
    id: string;
    info: {
      words: number;
      time: string;
    };
    issues: {
      type: string;
      match: {
        surface: string;
        beginOffset: number;
        endOffset: number;
        replacement: { value: string }[];
      };
    }[];
  }> {
    const response = await this.grammarBotClient.checkGrammar(text);
    const issues = response.matches.map((issue) => {
      return {
        type: issue.rule.category.label,
        match: {
          surface: issue.context.text,
          beginOffset: issue.offset,
          endOffset: issue.offset + issue.length,
          replacement: issue.replacements.map((replacement) => ({
            value: replacement.value,
          })),
        },
      };
    });
    return {
      id: 'unique-identifier',
      info: { words: text.split(' ').length, time: new Date().toString() },
      issues,
    };
  }
}
