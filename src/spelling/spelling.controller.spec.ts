import { Test, TestingModule } from '@nestjs/testing';
import { SpellingController } from './spelling.controller';
import { SpellingService } from './spelling.service';
import { IGrammarBotClient } from './clients';
import { LoggerService } from '../logger.service';
import { SpellValidation } from './spelling.types';
import { HttpException } from '@nestjs/common';

class MockGrammarBotClient implements IGrammarBotClient {
  checkGrammar(): Promise<any> {
    return Promise.resolve({});
  }
}

describe('SpellingController', () => {
  let spellingController: SpellingController;
  let spellingService: SpellingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpellingController],
      providers: [
        SpellingService,
        LoggerService,
        {
          provide: 'IGrammarBotClient',
          useClass: MockGrammarBotClient,
        },
      ],
    }).compile();

    spellingController = module.get<SpellingController>(SpellingController);
    spellingService = module.get<SpellingService>(SpellingService);
  });

  describe('getSuggestions', () => {
    it('should return suggestions for text', async () => {
      const text = 'This is a test';
      const suggestions: SpellValidation = {
        id: '123abc',
        info: {
          words: 5,
          time: '2022-05-01T12:00:00Z',
        },
        issues: [
          {
            type: 'misspelling',
            match: {
              surface: 'wodrs',
              beginOffset: 10,
              endOffset: 14,
              replacement: ['words'],
            },
          },
          {
            type: 'grammar',
            match: {
              surface: 'test',
              beginOffset: 8,
              endOffset: 12,
              replacement: ['tests'],
            },
          },
        ],
      };

      jest
        .spyOn(spellingService, 'checkSpelling')
        .mockResolvedValue(suggestions);

      expect(await spellingController.getSuggestions(text)).toBe(suggestions);
    });

    it.each`
      statusCode | errorMessage
      ${400}     | ${'Bad Request: Invalid request parameters'}
      ${401}     | ${'Unauthorized: Invalid API Key'}
      ${402}     | ${'Payment Required: Upgrade to a paid plan'}
      ${403}     | ${'Forbidden: API Key suspended or blocked'}
      ${429}     | ${'Too Many Requests: API Key has hit rate limit'}
      ${500}     | ${'Internal Server Error: Unexpected error'}
      ${503}     | ${'Service Unavailable: API is down for maintenance'}
    `(
      'should throw HttpException with code $statusCode and message $errorMessage when checkSpelling throws an error',
      async ({ statusCode, errorMessage }) => {
        const text = 'Susan go to the markt';
        jest.spyOn(spellingService, 'checkSpelling').mockImplementation(() => {
          throw new HttpException(errorMessage, statusCode);
        });
        await expect(
          spellingController.getSuggestions(text),
        ).rejects.toThrowError(new HttpException(errorMessage, statusCode));
      },
    );
  });
});
