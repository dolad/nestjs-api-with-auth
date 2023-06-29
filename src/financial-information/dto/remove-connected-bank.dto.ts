import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveConnectedBankDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  bankName: string;
}
