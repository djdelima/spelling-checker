import { Test, TestingModule } from '@nestjs/testing';
import { SpellingService } from './spelling.service';
import { GrammarBotClient } from './clients/grammar-bot-client/grammar-bot.client';

describe('SpellingService', () => {
  let service: SpellingService;

  beforeEach(async () => {
    process.env.API_KEY = 'your-key';
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpellingService,
        {
          provide: 'IGrammarBotClient',
          useClass: GrammarBotClient,
        },
      ],
    }).compile();

    service = module.get<SpellingService>(SpellingService);
  });

  it('should check spelling', async () => {
    const text = 'Susan go to the store everyday';
    const response = await service.checkSpelling(text);

    expect(response).toBeTruthy();
    expect(response.info.words).toEqual(text.split(' ').length);
    expect(response.issues.length).toBeGreaterThanOrEqual(0);
  });
});
