import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetFundingRequestsPartnerParamDTO {
  @ApiProperty()
  @IsString()
  @IsOptional()
  bankId: string;

  @ApiProperty({
    example: 'approved | rejected | pending',
  })
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
