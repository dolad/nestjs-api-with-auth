import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEmail } from 'class-validator';

export class ResendRegistationDTO {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string
}