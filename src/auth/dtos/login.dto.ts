import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class LoginDTO {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string


    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    password: string

}