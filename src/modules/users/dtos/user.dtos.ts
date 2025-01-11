import { ApiProperty } from "@nestjs/swagger"


export class CreateUserDto {
    @ApiProperty()
    phone: string;

    @ApiProperty()
    password: string

    @ApiProperty()
    interests: string;

    @ApiProperty()
    username: string;

    @ApiProperty()
    location: string;

    @ApiProperty()
    age: number;

}

export class LoginUserDto {
    @ApiProperty()
    user_id: string;

    @ApiProperty()
    password: string;
}