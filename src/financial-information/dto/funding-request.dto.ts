import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

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
