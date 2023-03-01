import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsDateString, IsNumber, IsOptional } from 'class-validator';

export class AddBusinessOwnerDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    firstName: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    lastName: string

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



export class UpdateBusinessOwnerDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    firstName?: string

    @ApiProperty()
    @IsString()
    @IsOptional()
    lastName?: string

    @ApiProperty()
    @IsOptional()
    @IsString()
    title?: string

    @ApiProperty()
    @IsOptional()
    @IsString()
    gender?: string

    @ApiProperty()
    @IsOptional()
    @IsString()
    employmentStatus?: string

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    annualIncome?: number

    @ApiProperty()
    @IsOptional()
    @IsDateString()
    dateOfBirth?: Date

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    personalCreditLimit?: number

    @ApiProperty()
    @IsOptional()
    @IsString()
    country?: string

    @ApiProperty()
    @IsOptional()
    @IsString()
    city?: string

    @ApiProperty()
    @IsOptional()
    @IsString()
    residentialAddress?: string

    @ApiProperty()
    @IsOptional()
    @IsString()
    residentialPostcode?: string
}


export class CreateBusinessEntity {
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