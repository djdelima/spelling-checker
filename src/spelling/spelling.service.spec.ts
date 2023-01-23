import { SpellingService } from './spelling.service';
import { IGrammarBotClient } from './clients/grammar-bot-client';
import { any } from 'jest-mock-extended';

describe('SpellingService', () => {
  let spellingService: SpellingService;
  let grammarBotClient: IGrammarBotClient;

  beforeEach(() => {
    grammarBotClient = {
      checkGrammar: jest.fn(),
    } as any;
    spellingService = new SpellingService(grammarBotClient);
  });

  describe('checkSpelling', () => {
    it('should check spelling of text', async () => {
      const text = 'This is a tst.';
      const response = {
        body: JSON.stringify({
          software: {
            name: 'GrammarBot',
            version: '1.0.0',
            apiVersion: 2,
            premium: false,
            premiumHint: '',
            status: 'OK',
          },
          warnings: {
            incompleteResults: false,
          },
          language: {
            name: 'English',
            code: 'en-US',
            detectedLanguage: {
              name: 'English',
              code: 'en-US',
            },
          },
          matches: [
            {
              message: 'Possible spelling mistake found',
              shortMessage: 'Spelling mistake',
              replacements: [{ value: 'test' }],
              offset: 10,
              length: 4,
              context: {
                text: 'This is a tst.',
                offset: 10,
                length: 4,
              },
              sentence: 'This is a tst.',
              type: { typeName: 'misspelling' },
              rule: {
                id: 'MORFOLOGIK_RULE_EN_US',
                description: 'English spellchecker',
                issueType: 'misspelling',
                category: {
                  id: 'TYPOS',
                  name: 'Possible Typo',
                },
              },
            },
          ],
        }),
      };
      (grammarBotClient.checkGrammar as jest.Mock).mockResolvedValue(response);

      const result = await spellingService.checkSpelling(text);
      expect(result.issues.length).toBe(1);
      expect(result.issues[0].type).toBe('Possible Typo');
      expect(result.issues[0].match.surface).toBe('This is a tst.');
      expect(result.info.words).toBe(4);
      expect(result.id).toBeTruthy();
    });

    it('should return an empty array of issues if the response body is empty', async () => {
      const text = 'This is a test.';
      const response = {
        body: JSON.stringify({
          software: {
            name: 'GrammarBot',
            version: '1.0.0',
            apiVersion: 2,
            premium: false,
            premiumHint: '',
            status: 'OK',
          },
          warnings: {
            incompleteResults: false,
          },
          language: {
            name: 'English',
            code: 'en-US',
            detectedLanguage: {
              name: 'English',
              code: 'en-US',
            },
          },
          matches: [],
        }),
      };
      (grammarBotClient.checkGrammar as jest.Mock).mockResolvedValue(response);

      const service = new SpellingService(grammarBotClient);
      const result = await service.checkSpelling(text);

      expect(result).toEqual({
        id: any(),
        info: { words: text.split(' ').length, time: expect.any(String) },
        issues: [],
      });
    });

    it('should throw an error if the grammar checker returns an error', async () => {
      jest.spyOn(grammarBotClient, 'checkGrammar').mockImplementation(() => {
        throw new Error('An error occurred');
      });

      const service = new SpellingService(grammarBotClient);
      await expect(service.checkSpelling('This is a test')).rejects.toThrow(
        'An error occurred',
      );
    });
  });
});
