import nock from 'nock';
import { GrammarBotClient } from './grammar-bot.client';
import { GrammarBotResponse } from './types';
import { LoggerService } from '../../../logger.service';

const mockGrammarBotResponse: GrammarBotResponse = {
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
      replacements: [{ value: 'word' }, { value: 'words' }],
      offset: 10,
      length: 4,
      context: {
        text: 'This is a test wodrs.',
        offset: 10,
        length: 4,
      },
      sentence: 'This is a test wodrs.',
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
};

describe('GrammarBotClient', () => {
  let client: GrammarBotClient;
  let logger: LoggerService;

  beforeEach(() => {
    process.env.API_KEY = 'test';
    logger = new LoggerService();
    client = new GrammarBotClient(logger);
  });

  afterEach(() => {
    // Clean all nock interceptors
    nock.cleanAll();
  });

  it('Grammar bot should return 200 with expected body', async () => {
    nock('https://grammarbot.p.rapidapi.com')
      .post('/check')
      .reply(200, mockGrammarBotResponse);

    const response = (await client.checkGrammar(
      'This is a test',
    )) as GrammarBotResponse;

    expect(response).toEqual(mockGrammarBotResponse);
  });

  it('should throw an error when the API returns a non-200 status code', async () => {
    await expect(client.checkGrammar('This is a test')).rejects.toThrow(
      'Error checking grammar:',
    );
  });

  test.each`
    statusCode | errorMessage
    ${401}     | ${'Response code 401 (Unauthorized)'}
    ${403}     | ${'Response code 403 (Forbidden)'}
    ${429}     | ${'Response code 429 (Too Many Requests)'}
    ${500}     | ${'Response code 500 (Internal Server Error)'}
    ${503}     | ${'Response code 503 (Service Unavailable)'}
  `(
    'should throw an error if the request returns a $statusCode status code',
    async ({ statusCode, errorMessage }) => {
      nock('https://grammarbot.p.rapidapi.com')
        .post('/check')
        .reply(statusCode, {});

      await expect(client.checkGrammar('This is a test')).rejects.toThrow(
        `Error checking grammar: ${errorMessage}`,
      );
    },
  );
});
