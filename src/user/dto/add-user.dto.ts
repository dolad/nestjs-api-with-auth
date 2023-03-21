import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";


export class AddUserToBusinessEntity {
    @ApiProperty()
    @IsOptional()
    @IsString()
    firstName: string;

    @ApiProperty()
    @IsOptional()
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
    @IsOptional()
    @IsString()
    email: string;


    @ApiProperty()
    @IsOptional()
    @IsString()
    password: string;




}

