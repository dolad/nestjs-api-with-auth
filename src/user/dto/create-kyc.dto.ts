import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEmail, IsString, IsDateString, IsNumber } from 'class-validator';

export class CreateKyCDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    title: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    gender: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    employmentStatus: string

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    annualIncome: number

    @ApiProperty()
    @IsNotEmpty()
    @IsDateString()
    dateOfBirth: Date

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    personalCreditLimit: number

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    country: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    city: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    residentialAddress: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    residentialPostcode: string
}