import {
  Body,
  Controller,
  Post,
  Put,
  UseGuards,
  Request,
  Get,
  Query,
  HttpStatus,
  HttpCode,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PartnerServices } from '../services';
import { PartnerLoginDTO } from '../dto/login';
import {
  IResponseMessage,
  wrapResponseMessage,
} from '../../utils/response.map';
import { UpdatePartnerPasswordDTO } from '../dto/update-password';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetFundingRequestsParamDTO } from 'src/financial-information/dto/funding-request.dto';
import { FinancialInformationServices } from 'src/financial-information/services/financial-info.services';
import { ApproveFundRequestPartnerDTO } from 'src/financial-information/dto/approveFundingRequest.dto';
import { PartnerRouteGuard } from 'src/auth/guards/partner.guard';

@Controller('partner')
@ApiTags('Partner')
export class PartnerController {
  constructor(
    private readonly partnerService: PartnerServices,
    private readonly financialServices: FinancialInformationServices,
  ) {}

  @Post('/login')
  async login(@Body() body: PartnerLoginDTO) {
    const response = await this.partnerService.login(body.email, body.password);

    return wrapResponseMessage('Partner login successful', response);
  }

  @Put('/update-password')
  @UseGuards(JwtAuthGuard, PartnerRouteGuard)
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
  @UseGuards(JwtAuthGuard, PartnerRouteGuard)
  async getFundingRequestStats(@Request() req) {
    const response = await this.partnerService.performanceStats(
      req.user.partnerId,
    );
    return wrapResponseMessage(
      'Partner funding request stats fetched successfully',
      response,
    );
  }

  @Get('/funding-request/recent-activities')
  @UseGuards(JwtAuthGuard, PartnerRouteGuard)
  async getRecentFundingRequests(@Request() req) {
    console.log(req.user.partnerId);
    const response = await this.partnerService.fundingRecentActivities(
      req.user.partnerId,
    );
    return wrapResponseMessage(
      'Partner recent funding requests fetched successfully',
      response,
    );
  }

  @Get('/funding-requests/')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, PartnerRouteGuard)
  async getFundingRequests(
    @Request() req,
    @Query() query: GetFundingRequestsParamDTO,
  ) {
    const whereOption = {
      bankId: req.user.partnerId,
    };

    if (query.status) {
      whereOption['fundingTransactionStatus'] = query.status;
    }

    const response = await this.financialServices.fetchFundingRequests(query, {
      where: whereOption,
    });

    return wrapResponseMessage(
      'Funding requests retrieved successfully.',
      response,
    );
  }

  @Get('/funding-request/:fundingId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, PartnerRouteGuard)
  async getFundingRequestsById(
    @Request() req,
    @Param('fundingId') fundingId: string,
  ) {
    const response = await await this.financialServices.fetchFundingRequestById(
      fundingId,
    );
    return wrapResponseMessage(
      'Funding requests retrieved successfully.',
      response,
    );
  }

  @Get('business/documents/:businessId')
  @UseGuards(JwtAuthGuard, PartnerRouteGuard)
  async getBusinessBankStatemnt(
    @Param('businessId') businessId: string,
  ): Promise<IResponseMessage> {
    const response = await this.financialServices.getBusinessBankStatement(
      businessId,
    );
    return wrapResponseMessage(
      'Business details fetched data fetched',
      response,
    );
  }

  @Post('request/approve')
  @UseGuards(JwtAuthGuard, PartnerRouteGuard)
  async approveRequestId(
    @Body() param: ApproveFundRequestPartnerDTO,
    @Request() req,
  ): Promise<IResponseMessage> {
    await this.financialServices.approveRequest(param, req.user.partnerId);
    return wrapResponseMessage(
      'Funding Request approved data fetched',
      'Successfully',
    );
  }
}
