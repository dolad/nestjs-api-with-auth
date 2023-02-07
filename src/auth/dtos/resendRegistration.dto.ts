import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class ResendRegistationDTO {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string
}


export class ResetPasswordVerfiyDTO {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    token: string
}

export class UpdatePasswordDTO {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    newPassword: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    confirmNewPassword: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    token: string
}