import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FetchPerformanceStatsDTO {
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
}

export class GetCustomerFundingRequestsParamDTO {
  @ApiProperty()
  @IsString()
  @IsOptional()
  bankId: string;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  from: Date;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  to: Date;
}
