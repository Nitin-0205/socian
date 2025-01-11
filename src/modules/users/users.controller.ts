import { Body, Controller, Post, Query, Get, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserDto, LoginUserDto } from './dtos/user.dtos';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService,
  ) { }

  @Post('signup')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  async userLogin(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.userLogin(loginUserDto);
  }

  @Patch('set-interests-empty')
  async setInterestsEmpty(@Query('userName') userName: string, @Query('longitude') longitude: string, @Query('latitude') latitude: string, @Query('interest') interest: string) {
    return this.usersService.setInterestsEmpty(userName, longitude, latitude, interest);
  }

  @Get('same-interests')
  async findUsersWithSameInterests(@Query('interests') interests: string, @Query('userName') userName: string) {
    return this.usersService.findUsersWithSameParentCategory(interests, userName);
  }

  @Get('trending-interests')
  async getTrendingInterests() {
    return this.usersService.getParentCategoryWithSubcategories();
  }


}
