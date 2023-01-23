import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseFilters,
} from '@nestjs/common';
import { SpellingService } from './spelling.service';

@Controller('spell-check')
export class SpellingController {
  constructor(private readonly spellingService: SpellingService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async getSuggestions(@Body('text') text: string) {
    return this.spellingService.checkSpelling(text);
  }
}
