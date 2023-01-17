import { Test, TestingModule } from '@nestjs/testing';
import { SpellingService } from './spelling.service';

describe('SpellingService', () => {
  let service: SpellingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpellingService],
    }).compile();

    service = module.get<SpellingService>(SpellingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkSpelling', () => {
    it('should return the correct spelling issues', () => {
      const text = 'This is a test of teh speeling checker.';
      const expected = {
        id: 'unique-identifier',
        info: {
          words: 7,
          time: expect.any(String),
        },
        issues: [
          {
            type: 'spelling',
            match: {
              surface: 'teh',
              beginOffset: 14,
              endOffset: 17,
              replacement: ['the'],
            },
          },
          {
            type: 'spelling',
            match: {
              surface: 'speeling',
              beginOffset: 20,
              endOffset: 27,
              replacement: ['spelling'],
            },
          },
        ],
      };

      expect(service.checkSpelling(text)).toEqual(expected);
    });
  });
});
