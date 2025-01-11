import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateGameDto, SubmitAnswerDto } from './dto/game.dto';
import axios from 'axios';

@Injectable()
export class GamesService {
    constructor(private readonly prismaService: PrismaService) { }

    async createGame(createGameDto: CreateGameDto) {
        const { player1_id, player2_id } = createGameDto;

        const game = await this.prismaService.game.create({
            data: {
                player1_id,
                player2_id,
                status: 'pending',
            },
        });

        const questions = await this.fetchTriviaQuestions();
        for (const question of questions) {
            await this.prismaService.question.create({
                data: {
                    game_id: game.game_id,
                    question_text: question.question,
                    correct_answer: question.correct_answer,
                },
            });
        }

        return game;
    }

    async fetchTriviaQuestions() {
        const response = await axios.get('https://opentdb.com/api.php?amount=10&type=multiple');
        return response.data.results;
    }

    async submitAnswer(submitAnswerDto: SubmitAnswerDto) {
        const { game_id, player_id, question_id, answer } = submitAnswerDto;

        const question = await this.prismaService.question.findUnique({
            where: { question_id },
        });

        if (!question) {
            throw new HttpException('Question not found', HttpStatus.NOT_FOUND);
        }

        const isCorrect = question.correct_answer === answer;
        const score = isCorrect ? 1 : 0;

        await this.prismaService.score.create({
            data: {
                game_id,
                player_id,
                score,
            },
        });

        return { isCorrect, score };
    }
}