import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { SpellingService } from './spelling.service';

@Controller('spell-check')
export class SpellingController {
  constructor(private readonly spellingService: SpellingService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async getSuggestions(@Body() text: string) {
    return await this.spellingService.checkSpelling(text);
  }
}
