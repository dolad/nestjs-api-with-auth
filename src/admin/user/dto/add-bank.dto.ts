import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class AddPatnerDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  providerName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  postcode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  country: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  businessTypes: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  contactPersonFirstname: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  contactPersonLastname: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  contactPersonTitle: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  contactPersonGender: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  contactPersonPosition: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  contactPersonDateofBirth: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  contactPersonCountry: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  contactPersonCity: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  contactPersonAddress: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  contactPersonPostcode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  minimumLoanAmount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  minimumBusinessEstablishmentPeriod: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  maximumLoanAmount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  minimumAnnualTurnOver: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  interestRate: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  repaymentTime: string;
}


