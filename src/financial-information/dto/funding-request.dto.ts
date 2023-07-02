import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
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

export class GetPerformanceStatParam {
  @ApiProperty()
  @IsString()
  bankId: string;
}

export class GetFundingRequestsParamDTO {
  @ApiProperty()
  @IsString()
  @IsOptional()
  bankId?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  businessId?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  rows?: number;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  from?: Date;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  to?: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  page?: number;
}

export class GetFundingRequestsByBusinessIdDTO extends GetFundingRequestsParamDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  businessId: string;
}

export class GetFundingRequestsByBankIdDTO extends GetFundingRequestsParamDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  bankId: string;
}

export class GetFundingRequestsByBankIdStatDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  bankId: string;
}

export interface FundingPerformanceStat {
  totalAmountRequested: number;
  totalAmountIssued: number;
  totalAmountDeclined: number;
  totalAmountPending: number;
  totalRequest?: number;
  approvedRequest?: number;
  declinedRequest?: number;
  pendingRequest?: number;
}
