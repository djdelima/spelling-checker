import { GrammarBotClient } from './grammar-bot.client';
import { LoggerService } from '~/logger.service';

describe('GrammarBotClient', () => {
  let client: GrammarBotClient;
  const logger = new LoggerService();

  test('checkGrammar', async () => {
    process.env.API_KEY = 'your-key';
    client = new GrammarBotClient(logger);
    const text = 'Susan go to the store everyday';
    const language = 'en-US';
    const response = await client.checkGrammar(text, language);

    expect(response).toBeDefined();
    // more assertions based on the expected response
  });

  it('should throw an error when an invalid API key is used', async () => {
    // Use an invalid API key
    process.env.apiKey = 'invalid-key';
    const client = new GrammarBotClient(logger);

    try {
      await client.checkGrammar('This is a test text.');
      fail('An error should have been thrown');
    } catch (error: any) {
      expect(error.message).toContain('Error checking grammar:');
    }
  });
});
