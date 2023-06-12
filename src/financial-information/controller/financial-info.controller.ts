import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetFundingParterParam } from 'src/user/interface/get-funding-partner';
import { UserServices } from 'src/user/services/user.services';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  wrapResponseMessage,
  IResponseMessage,
} from '../../utils/response.map';
import { AddFundingRequest } from '../dto/funding-request.dto';
import { RemoveConnectedBankDTO } from '../dto/remove-connected-bank.dto';
import { FinancialInformationServices } from '../services/financial-info.services';
import { FetchPerformanceStatsDTO } from '../dto/performance-stat-dto';

@Controller('financial-information')
@ApiTags('Financial')
export class FinancialInfoController {
  constructor(
    private readonly financeServices: FinancialInformationServices,
    private readonly userService: UserServices,
  ) {}

  @Get('/fetch-provider-countries')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getSupportedCountries(): Promise<IResponseMessage> {
    const response = await this.financeServices.getSuppportedCountries();
    return wrapResponseMessage('business Information Successfully', response);
  }

  @Get('/fetch-provider')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getSupportedBankProvider(): Promise<IResponseMessage> {
    const response = await this.financeServices.getSupportedBank();
    return wrapResponseMessage('business Information Successfully', response);
  }

  @Post('/connect')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async connectBankProvider(@Request() req): Promise<IResponseMessage> {
    const response = await this.financeServices.connectBankKyc(req.user);
    return wrapResponseMessage('business Information Successfully', response);
  }

  @Post('/funding-requirement')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async addFundingRequirement(
    @Request() req,
    @Body() fundingRequirementPayload: AddFundingRequest,
  ): Promise<IResponseMessage> {
    const response = await this.financeServices.createFundingRequest(
      req.user,
      fundingRequirementPayload,
    );
    return wrapResponseMessage('business Information Successfully', response);
  }

  @Get('/get-connected-bank')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getConnectedBank(@Request() req): Promise<IResponseMessage> {
    const response = await this.financeServices.fetchConnectedBanks(req.user);
    return wrapResponseMessage('business Information Successfully', response);
  }

  @Get('/funding-patners')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async fetchFundingPartner(
    @Query() getFundingPartnerParam: GetFundingParterParam,
  ): Promise<IResponseMessage> {
    const response = await this.userService.fetchFundingPartner(
      getFundingPartnerParam,
    );

    return wrapResponseMessage('funding partner found successfully', response);
  }

  @Get('/supported-funding-provider-name')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async fetchFundingPartnerName(): Promise<IResponseMessage> {
    const response = await this.userService.fetchSupportedFundingProvider();
    return wrapResponseMessage('funding partner name', response);
  }

  @Post('/remove-connected-bank')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async disconnectConnectedBank(
    @Request() req,
    @Body() removedConnectedBankPayload: RemoveConnectedBankDTO,
  ): Promise<IResponseMessage> {
    const response = await this.financeServices.disableBankConnection(
      req.user,
      removedConnectedBankPayload.bankName,
    );
    return wrapResponseMessage('business Information Successfully', response);
  }

  @Get('/funding-request-performance-stats')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getFundingRequestPerformanceStats(
    @Query() query: FetchPerformanceStatsDTO,
  ): Promise<any> {
    const { bankId, from, to } = query;
    const response = await this.financeServices.fetchPerformanceStats(
      bankId,
      from,
      to,
    );

    return wrapResponseMessage(
      'Funding request performance retrieved successfully.',
      response,
    );
  }

  @Get('/funding-request-recent-activity/:bank_id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getFundingRequestRecentActivity(
    @Param('bank_id') bankId: string,
  ): Promise<any> {
    const response =
      await this.financeServices.fetchFundingRequestRecentActivities(bankId);

    return wrapResponseMessage(
      'Recent activities retrieved successfully.',
      response,
    );
  }
}
