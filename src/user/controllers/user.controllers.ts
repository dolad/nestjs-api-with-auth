import { Controller, Post, UseGuards, Request, Body, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IResponseMessage, wrapResponseMessage } from 'src/utils/response.map';
import { AddBusinessInformationDTO, CreateKyCDto } from '../dto/create-kyc.dto';
import { EnabledTwoFaAuthPayload } from '../dto/enable-2fa.dto';
import { KycServices } from '../services/user-kyc.services';
import { UserServices } from '../services/user.services';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly kycService: KycServices, private readonly userService: UserServices) {}

  @Post('kyc/add-owner-information')
  @UseGuards(JwtAuthGuard)
  async createBusinessOwnerInformation(@Request() req, @Body() payload: CreateKyCDto): Promise<IResponseMessage> {
    const response = await this.kycService.createKycUser(payload, req.user);
     return wrapResponseMessage("owner information added succesfully", response);
  }

  @Post('kyc/add-business-information')
  @UseGuards(JwtAuthGuard)
  async createBusinessInformation(@Request() req, @Body() payload: AddBusinessInformationDTO): Promise<IResponseMessage> {
    const response = await this.kycService.addBusinessName(payload, req.user);
    return wrapResponseMessage("business information added", response);
  }

  @Post('enable-two-fa')
  @UseGuards(JwtAuthGuard)
  async enableTwoFa(@Request() req, @Body() payload:EnabledTwoFaAuthPayload): Promise<IResponseMessage> {
    const response = await this.userService.enableTwoFaAuth(req.user, payload.type);
    return wrapResponseMessage("twoFactorAuthentication enabled", response);
  }

  
}
