import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";


export class AddUserToBusinessEntity {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    lastName: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    permission: string;


    @ApiProperty()
    @IsOptional()
    @IsString()
    phone: string;


    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    email: string;


    @ApiProperty()
    @IsOptional()
    @IsString()
    password?: string;

}

