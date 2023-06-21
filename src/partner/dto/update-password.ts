import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePartnerPasswordDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
}
