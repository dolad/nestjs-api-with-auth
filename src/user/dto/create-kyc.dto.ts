import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsDateString, IsNumber } from 'class-validator';

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


export class AddBusinessInformationDTO {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    businessName: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    businessType: string


    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    businessAddress: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    businessPostcode: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    businessCountry: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    businessCity: string;




}