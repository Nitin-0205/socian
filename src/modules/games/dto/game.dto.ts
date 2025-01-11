export class CreateGameDto {
    player1_id: number;
    player2_id: number;
}

export class SubmitAnswerDto {
    game_id: number;
    player_id: number;
    question_id: number;
    answer: string;
}