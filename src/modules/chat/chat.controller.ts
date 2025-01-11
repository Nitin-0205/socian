import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) { }

  @Post('send')
  async sendMessage(
    @Body('senderId') senderId: number,
    @Body('receiverId') receiverId: number,
    @Body('message') message: string,
  ) {
    return this.chatService.sendMessage(senderId, receiverId, message);
  }

  @Get('messages')
  async getMessages(
    @Query('senderId') senderId: number,
    @Query('receiverId') receiverId: number,
  ) {
    return this.chatService.getMessages(senderId, receiverId);
  }
}