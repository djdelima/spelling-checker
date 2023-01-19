import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseFilters,
} from '@nestjs/common';
import { SpellingService } from './spelling.service';
import { HttpErrorFilter } from '../filters/http-error.filter';

@Controller('spell-check')
@UseFilters(HttpErrorFilter)
export class SpellingController {
  constructor(private readonly spellingService: SpellingService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async getSuggestions(@Body('text') text: string) {
    return this.spellingService.checkSpelling(text);
  }
}
