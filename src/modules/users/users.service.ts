import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dtos/user.dtos';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
    constructor(
        private readonly prismaService: PrismaService,
        // private readonly jwtService: JwtService,
    ) { }

    async create(createUserDto: CreateUserDto) {

        const checkuser = await this.prismaService.user.findFirst({ where: { username: createUserDto.username } });
        console.log("checkuser", createUserDto.username);
        if (checkuser) {
            throw new HttpException("User Already Exists !!!", HttpStatus.BAD_REQUEST);
        }

        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = await this.prismaService.user.create({
            data: {
                phone: createUserDto.phone,
                password: hashedPassword,
                interests: createUserDto.interests,
                username: createUserDto.username,
                location: createUserDto.location,
                age: Number(createUserDto.age),
            }
        });

        if (!user) {
            throw new HttpException("User Not Created !!!", HttpStatus.BAD_REQUEST);
        }

        return { msg: "User SignUp Successfull !!!" };
    }

    async userLogin(loginUserDto: LoginUserDto) {
        const user = await this.prismaService.user.findFirst({ where: { username: loginUserDto.user_id } });
        console.log("user", user);
        if (!user) {
            throw new HttpException("User Not Found !!!", HttpStatus.NOT_FOUND);
        }
        const isMatch = await bcrypt.compare(loginUserDto.password, user.password);
        if (!isMatch) {
            throw new HttpException("Invalid Credentials !!!", HttpStatus.BAD_REQUEST);
        }
        // const token = this.jwtService.sign({ id: user.user_id, username: user.username });
        return { msg: "User Login Successfull !!!", userId: user.username };
    }


    async setInterestsEmpty(userId: string, longitude: string, latitude: string, interest: string) {

        const checkUser = await this.prismaService.user.findFirst({ where: { username: userId } });

        console.log("checkUser", checkUser);

        if (!checkUser) {
            throw new HttpException("User Not Found !!!", HttpStatus.NOT_FOUND);
        }

        const user = await this.prismaService.user.update({
            where: { username: userId },
            data: {
                interests: interest,
                longitude: longitude,
                latitude: latitude,
            },
        });

        if (!user) {
            throw new HttpException("User not found", HttpStatus.NOT_FOUND);
        }

        return { msg: "User interests set to empty", userId: user.user_id };
    }

    async findUsersWithSameParentCategory(categoryName: string, userName: string) {
        console.log("categoryName", categoryName, userName);
        // Fetch the parent category

        if (!categoryName || !userName) {
            throw new HttpException("Category Name is required", HttpStatus.BAD_REQUEST);
        }
        const parentCategory = await this.prismaService.category.findFirst({
            where: {
                name: {
                    contains: categoryName,
                    mode: 'insensitive',
                },
                parent_id: { not: null },
            },
        });
        console.log("parentCategory", parentCategory);

        if (!parentCategory) {
            throw new HttpException("Parent category not found", HttpStatus.NOT_FOUND);
        }

        // Fetch subcategories of the parent category
        const subcategories = await this.prismaService.category.findMany({
            where: { parent_id: parentCategory.parent_id },
        });

        console.log("subcategories", subcategories, parentCategory.category_id);

        const subcategoryNames = subcategories.map(subcategory => subcategory.name);

        // Fetch users with interests in the subcategories
        const usersWithSubcategoryInterests = await this.prismaService.user.findMany({
            where: {
                interests: {
                    in: subcategoryNames,
                },
                NOT: {
                    username: userName,
                }
            },
        });

        // Fetch users with interests containing the parent category
        const usersWithParentCategoryInterests = await this.prismaService.user.findMany({
            where: {
                interests: {
                    contains: categoryName,
                }
            },
        });

        // Combine the results, ensuring no duplicates
        const combinedUsers = [...usersWithSubcategoryInterests, ...usersWithParentCategoryInterests.filter(user => !usersWithSubcategoryInterests.some(subUser => subUser.user_id === user.user_id))];

        if (!combinedUsers || combinedUsers.length === 0) {
            throw new HttpException("No users found with the same parent category", HttpStatus.NOT_FOUND);
        }

        return combinedUsers;
    }

    async getTrendingInterests() {
        const users = await this.prismaService.user.findMany({
            select: {
                interests: true,
            },
        });

        const interestsCount = users.reduce((acc, user) => {
            if (user.interests) {
                const interests = user.interests.split(',');
                interests.forEach((interest) => {
                    acc[interest] = (acc[interest] || 0) + 1;
                });
            }
            return acc;
        }, {});

        const trendingInterests = Object.entries(interestsCount)
            .sort(([, a], [, b]) => (b as number) - (a as number))
            .map(([interest]) => interest);

        return trendingInterests;
    }

    async getParentCategoryWithSubcategories() {
        // Fetch the parent category
        const parentCategory = await this.prismaService.category.findMany({
            where: { parent_id: null },
            include: {
                subcategories: true,
            },
        });

        if (!parentCategory) {
            throw new HttpException("Parent category not found", HttpStatus.NOT_FOUND);
        }

        const parentCategoryWithSubcategories = parentCategory

        return parentCategoryWithSubcategories;
    }



}
