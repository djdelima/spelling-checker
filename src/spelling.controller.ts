import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { SpellingService } from './spelling.service';

@Controller('suggestions')
export class SuggestionsController {
    constructor(private readonly spellingService: SpellingService) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    async getSuggestions(@Body() text: string) {
        return await this.spellingService.checkSpelling(text);
    }
}