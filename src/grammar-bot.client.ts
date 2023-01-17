import got from 'got';

export class GrammarBotClient {
  private readonly apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async checkGrammar(text: string): Promise<any> {
    try {
      const response = await got.post('https://api.grammarbot.io/v2/check', {
        json: {
          text,
          language: 'en-US',
        },
        headers: {
          Authorization: `Token ${this.apiKey}`,
        },
      });
      return response.body;
    } catch (error) {
      throw new Error(`Error checking grammar: ${error.message}`);
    }
  }
}
