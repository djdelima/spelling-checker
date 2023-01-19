import nock from 'nock';
import { GrammarBotClient } from './grammar-bot.client';
import { GrammarBotResponse } from './types';

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

  beforeEach(() => {
    process.env.API_KEY = 'test';
    client = new GrammarBotClient();
  });

  afterEach(() => {
    // Clean all nock interceptors
    nock.cleanAll();
  });

  it('Grammar bot should return 200 with expected body', async () => {
    nock('https://grammarbot.p.rapidapi.com')
      .post('/check')
      .reply(200, mockGrammarBotResponse);

    const response = await client.checkGrammar('This is a test');

    expect(response.statusCode).toBe(200);
    expect(<GrammarBotResponse>JSON.parse(response.body)).toEqual(
      mockGrammarBotResponse,
    );
  });

  it('should throw an error when the API returns a non-200 status code', async () => {
    await expect(client.checkGrammar('This is a test')).rejects.toThrow(
      'Error checking grammar:',
    );
  });
});
