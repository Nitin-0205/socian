import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersModule } from './modules/users/users.module';
import { ChatModule } from './modules/chat/chat.module';
import { GamesModule } from './modules/games/games.module';

@Global()
@Module({
  imports: [PrismaModule, UsersModule, ChatModule, GamesModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule { }
