import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class AddPatnerDTO {
  @ApiProperty()
  @IsOptional()
  @IsString()
  contactPersonFirstname: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  contactPersonLastname: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  contactPersonTitle: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  contactPersonGender: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  contactPersonPosition: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  contactPersonDateofBirth: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  contactPersonCountry: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  contactPersonCity: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  contactPersonAddress: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  contactPersonPostcode: string;
}
