import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { Kyc } from 'src/storage/postgres/kyc.schema';
import { CreateKyCDto } from '../dto/create-kyc.dto';
import { KycServices } from '../services/user-kyc.services';

@Controller('user')
export class UserController {
  constructor(private readonly kycService: KycServices) {}

  @Post('kyc')
  @UseGuards(JwtAuthGuard)
  async getHello(@Request() req, @Body() payload: CreateKyCDto): Promise<Kyc> {
    return await this.kycService.createKycUser(payload, req.user);
  }
}
