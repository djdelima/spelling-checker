import nock from 'nock';
import { GrammarBotClient } from './grammar-bot.client';

describe('Grammar Bot Client', () => {
  let connector: GrammarBotClient;
  let apiKey: string;
  let text: string;

  beforeEach(() => {
    apiKey = 'test-api-key';
    text = 'This is a test text to check grammar.';
    connector = new GrammarBotClient(apiKey);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should check grammar and return correct response', async () => {
    const mockResponse = {
      matches: [
        {
          message: 'Use "a" instead of "an" before "test"',
          shortMessage: 'Use "a" instead of "an"',
          offset: 8,
          length: 2,
          context: {
            text: 'This is an test sentence.',
            left: 'This is ',
            right: ' test sentence.',
          },
          sentence: 'This is an test sentence.',
          type: 'TYPOS',
          rule: {
            id: 'UPPERCASE_SUGGESTION',
            description:
              'Checks for uppercase words that are not at the beginning of the sentence, and suggests lowercasing them.',
            issueType: 'typographical',
            category: 'Grammar',
          },
        },
      ],
    };

    nock('https://api.grammarbot.io')
      .post('/v2/check')
      .reply(200, JSON.stringify(mockResponse));

    const response = await connector.checkGrammar(text);

    expect(response).toEqual(mockResponse);
  });

  it('should throw an error when the API returns a non-200 status code', async () => {
    const scope = nock('https://api.grammarbot.io')
      .post('/v2/check')
      .reply(400, { error: 'bad request' });

    await expect(connector.checkGrammar(text)).rejects.toThrowError(
      'Error checking grammar: Response code 400 (Bad Request)',
    );
    scope.done();
  });
});
