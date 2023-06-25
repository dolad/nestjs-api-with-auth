import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { FundingTransationStatus } from 'src/config/interface';

export type PartnerRequestApprovedInputDto =
  | FundingTransationStatus.APPROVED
  | FundingTransationStatus.DECLINED;

export class ApproveFundRequestPartnerDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fundingId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  status: FundingTransationStatus;

  @ApiProperty()
  @IsString()
  @IsOptional()
  comments?: string;
}
