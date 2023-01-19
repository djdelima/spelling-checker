import { Injectable } from '@nestjs/common';
import { SpellValidation } from './spelling.types';

@Injectable()
export class SpellingTestService {
  async checkSpelling(text: string): Promise<SpellValidation> {
    //Mocking a response here
    const spellValidation: SpellValidation = {
      id: 'unique-identifier',
      info: { words: text.split(' ').length, time: new Date().toString() },
      issues: [],
    };

    return spellValidation;
  }
}
