import { GrammarBotClient } from './grammar-bot.client';
import got from 'got';

jest.mock('got');

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

  it('should check grammar with the API', async () => {
    const mockResponse = { body: { matches: [{}] } };
    (got.post as jest.Mock).mockResolvedValue(mockResponse);

    const result = await connector.checkGrammar(text);

    expect(result).toEqual(mockResponse.body);
    expect(got.post).toHaveBeenCalledWith(
      'https://api.grammarbot.io/v2/check',
      {
        json: {
          text,
          language: 'en-US',
        },
        headers: {
          Authorization: `Token ${apiKey}`,
        },
      },
    );
  });

  it('should throw an error when the API returns a non-200 status code', async () => {
    const text = 'This is a sample text';
    got.post = jest.fn().mockRejectedValue(new Error('non-200 status code'));
    await expect(connector.checkGrammar(text)).rejects.toThrowError(
      'Error checking grammar: non-200 status code',
    );
  });
});
