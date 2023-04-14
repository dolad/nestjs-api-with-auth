import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class GoogleSignDto  {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    code: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    city: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    country: string

    @ApiProperty()
     @IsNotEmpty()
    @IsString()
    deviceName: string
}