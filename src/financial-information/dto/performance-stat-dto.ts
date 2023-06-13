import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

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
