import {
  Body,
  Controller,
  Post,
  Put,
  UseGuards,
  Request,
  Get,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PartnerServices } from '../services';
import { PartnerLoginDTO } from '../dto/login';
import { wrapResponseMessage } from '../../utils/response.map';
import { UpdatePartnerPasswordDTO } from '../dto/update-password';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetFundingRequestStatsDTO } from '../dto/funding-request';

@Controller('partner')
@ApiTags('Partner')
export class PartnerController {
  constructor(private readonly partnerService: PartnerServices) {}

  @Post('/login')
  async login(@Body() body: PartnerLoginDTO) {
    const response = await this.partnerService.login(body.email, body.password);

    return wrapResponseMessage('Partner login successful', response);
  }

  @Put('/update-password')
  @UseGuards(JwtAuthGuard)
  async updatePassword(@Body() body: UpdatePartnerPasswordDTO, @Request() req) {
    const response = await this.partnerService.updatePassword(
      req.user.partnerId,
      body.password,
    );
    return wrapResponseMessage(
      'Partner password updated successfully',
      response,
    );
  }

  @Get('/funding-requests/stats')
  @UseGuards(JwtAuthGuard)
  async getFundingRequestStats(
    @Request() req,
    @Query() query: GetFundingRequestStatsDTO,
  ) {
    const response = await this.partnerService.performanceStats(
      req.user.partnerId,
      query.from,
      query.to,
    );
    return wrapResponseMessage(
      'Partner funding request stats fetched successfully',
      response,
    );
  }

  @Get('/funding-request/recent-activities')
  @UseGuards(JwtAuthGuard)
  async getRecentFundingRequests(@Request() req) {
    const response = await this.partnerService.fundingRecentActivities(
      req.user.partnerId,
    );
    return wrapResponseMessage(
      'Partner recent funding requests fetched successfully',
      response,
    );
  }
}
