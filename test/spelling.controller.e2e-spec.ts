import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { HttpErrorFilter } from '../src/filters/http-error.filter';
import { INestApplication } from '@nestjs/common';
import { GrammarBotClient } from '../src/spelling/clients/grammar-bot-client/grammar-bot.client';
import { SpellingController } from '../src/spelling/spelling.controller';
import { SpellingService } from '../src/spelling/spelling.service';

describe('SpellingController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    process.env.API_KEY = 'your-key';
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpellingController],
      providers: [
        SpellingService,
        {
          provide: 'IGrammarBotClient',
          useClass: GrammarBotClient,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalFilters(new HttpErrorFilter());
    await app.init();
  });

  it('/spell-check (POST)', () => {
    return request(app.getHttpServer())
      .post('/spell-check')
      .send({ text: 'Susan go to the store everyday' })
      .expect(200)
      .expect({
        id: 'unique-identifier',
        info: { words: 4, time: new Date().toString() },
        issues: [],
      });
  });
});
