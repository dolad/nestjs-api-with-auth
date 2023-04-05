import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";


export class AddFundingRequirement {
    @ApiProperty()
    @IsString()
    @IsOptional()
    fundingAmount?: number;

    @ApiProperty()
    @IsString()
    @IsOptional()    
    fundingDescription?: string; 
    
    @ApiProperty()
    @IsString()
    @IsOptional()
    paymentPeriod?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()    
    fundingBank?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()    
    numberOfHiredEmployment?: number;

    @ApiProperty()
    @IsString()
    @IsOptional()    
    amountSpendOnResearch?: number;

}