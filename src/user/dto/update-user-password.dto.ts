import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";


export class ChangePasswordPayload {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    newPassword: string


    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    oldPassword: string
}



export class UpdateCreatorDetails {
    @ApiProperty()
    @IsOptional()
    @IsString()
    profileImage: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    firstName: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    lastName: string;

}

