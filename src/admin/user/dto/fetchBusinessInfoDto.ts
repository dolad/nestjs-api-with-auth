import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetCustomerInformationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  businessId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fundingId: string;
}
