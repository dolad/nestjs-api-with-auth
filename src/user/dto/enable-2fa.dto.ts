import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

enum TwoFaEnum {
    EMAIL = 'email',
    SMS = 'sms'
}

export class EnabledTwoFaAuthPayload {
    @ApiProperty({
        enum:TwoFaEnum,
        example: 'sms | email'
    })
    @IsNotEmpty()
    @IsString()
    type: string
}