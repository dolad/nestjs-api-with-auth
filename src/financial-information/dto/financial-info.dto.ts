import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateFinancialInformationDTO {
  @ApiProperty()
  @IsString()
  @IsOptional()
  businessName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  businessType?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  businessAddress?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  businessPostcode?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  businessCountry?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  businessCity?: string;

  @ApiProperty()
  @IsString()
  businessId: string;
}

export interface FetchRequestByCustomerGroupDTO {
  bankId?: string;
  businessId?: string;
  from?: Date;
  to?: Date;
  rows?: number;
  page?: number;
  status?: string;
}
