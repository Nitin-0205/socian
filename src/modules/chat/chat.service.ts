import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ChatService {
    constructor(private readonly prismaService: PrismaService) { }

    async sendMessage(senderId: number, receiverId: number, message: string) {
        return this.prismaService.chat.create({
            data: {
                sender_id: senderId,
                receiver_id: receiverId,
                message: message,
            },
        });
    }

    async getMessages(senderId: number, receiverId: number) {
        return this.prismaService.chat.findMany({
            where: {
                OR: [
                    { sender_id: senderId, receiver_id: receiverId },
                    { sender_id: receiverId, receiver_id: senderId },
                ],
            },
            orderBy: {
                sent_at: 'asc',
            },
        });
    }
}