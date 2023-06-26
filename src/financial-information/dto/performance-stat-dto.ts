import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class FetchPerformanceStatsDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  bankId: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  from: Date;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  to: Date;
}

export class GetCustomerFundingRequestsParamDTO {
  @ApiProperty()
  @IsString()
  @IsOptional()
  bankId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  businessId: string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  from: Date;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  to: Date;
}
