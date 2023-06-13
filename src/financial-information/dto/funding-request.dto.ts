import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export enum PAYMENTPERIOD {
  THREEMONTH = '3M',
  SIXMONTH = '6M',
  TWELVEMONTH = '12M',
  EIGHTEENMONTH = '18M',
}

export class AddFundingRequest {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  fundingAmount: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fundingDescription: string;

  @ApiProperty()
  @IsString()
  @IsEnum(PAYMENTPERIOD)
  @IsNotEmpty()
  paymentPeriod: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  bankId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  numberOfHiredEmployee: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  amountSpendOnResearch: number;
}

export class GetFundingRequestsParamDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  bankId: string;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  from: Date;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  to: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  rows?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  page?: number;
}
