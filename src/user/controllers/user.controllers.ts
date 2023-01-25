import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { Kyc } from 'src/storage/postgres/kyc.schema';
import { AddBusinessInformationDTO, CreateKyCDto } from '../dto/create-kyc.dto';
import { KycServices } from '../services/user-kyc.services';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly kycService: KycServices) {}

  @Post('kyc/add-owner-information')
  @UseGuards(JwtAuthGuard)
  async createBusinessOwnerInformation(@Request() req, @Body() payload: CreateKyCDto): Promise<Kyc> {
    return await this.kycService.createKycUser(payload, req.user);
  }

  @Post('kyc/add-business-information')
  @UseGuards(JwtAuthGuard)
  async createBusinessInformation(@Request() req, @Body() payload: AddBusinessInformationDTO): Promise<string> {
    return await this.kycService.addBusinessName(payload, req.user);
  }
}
