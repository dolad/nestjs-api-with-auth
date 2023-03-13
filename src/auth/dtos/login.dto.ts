import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEmail, IsString, IsOptional } from 'class-validator';

export class LoginDTO {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    password: string

    @ApiProperty()
    @IsOptional()
    @IsString()
    city?: string

    @ApiProperty()
    @IsOptional()
    @IsString()
    country?: string

    @ApiProperty()
    @IsOptional()
    @IsString()
    deviceName?: string

}