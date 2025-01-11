import { Controller, Post, Body } from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto, SubmitAnswerDto } from './dto/game.dto';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) { }

  @Post('create')
  async createGame(@Body() createGameDto: CreateGameDto) {
    return this.gamesService.createGame(createGameDto);
  }

  @Post('submit-answer')
  async submitAnswer(@Body() submitAnswerDto: SubmitAnswerDto) {
    return this.gamesService.submitAnswer(submitAnswerDto);
  }
}