import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdatePatnerInformationDTO {
  @ApiProperty()
  @IsOptional()
  @IsString()
  providerName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  address: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  postcode: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  country: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  city: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  businessTypes: string[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  contactPersonFirstname: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  contactPersonLastname: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  contactPersonTitle: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  contactPersonGender: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  contactPersonPosition: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  contactPersonDateofBirth: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  contactPersonCountry: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  contactPersonCity: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  contactPersonAddress: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  contactPersonPostcode: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  minimumLoanAmount: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  minimumBusinessEstablishmentPeriod: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  maximumLoanAmount: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  minimumAnnualTurnOver: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  interestRate: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  repaymentTime: string;
}
