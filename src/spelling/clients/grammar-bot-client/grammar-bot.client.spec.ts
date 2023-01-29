import nock from 'nock';
import { GrammarBotClient } from './grammar-bot.client';
import { LoggerService } from '../../../logger.service';
import { GrammarBotResponseDTO } from './types';
import { GrammarBotError } from '../../../errors/grammar-bot.error';

const mockGrammarBotResponse: GrammarBotResponseDTO = {
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
      .post(/check.*/)
      .reply(200, mockGrammarBotResponse);

    const response = await client.checkGrammar('This is a test words.');
    expect(response).toEqual(mockGrammarBotResponse);
  });

  test.each`
    statusCode | errorMessage
    ${400}     | ${'Bad Request: Invalid request parameters'}
    ${401}     | ${'Unauthorized: Invalid API Key'}
    ${402}     | ${'Payment Required: Upgrade to a paid plan'}
    ${403}     | ${'Forbidden: API Key suspended or blocked'}
    ${429}     | ${'Too Many Requests: API Key has hit rate limit'}
    ${500}     | ${'Internal Server Error: Unexpected error'}
    ${503}     | ${'Service Unavailable: API is down for maintenance'}
  `(
    'should throw an error if the request returns a $statusCode status code',
    async ({ statusCode, errorMessage }) => {
      nock('https://grammarbot.p.rapidapi.com')
        .post(/check.*/)
        .reply(statusCode, {});

      try {
        await client.checkGrammar('This is a test');
      } catch (err) {
        expect(err).toBeInstanceOf(GrammarBotError);
        expect(err.message).toBe(errorMessage);
        expect(err.httpCode).toBe(statusCode);
      }
    },
  );
});
