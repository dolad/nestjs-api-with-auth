import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class GetFundingRequestStatsDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  from: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  to: string;
}
