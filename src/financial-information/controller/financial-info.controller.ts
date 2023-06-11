import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetFundingParterParam } from 'src/user/interface/get-funding-partner';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  wrapResponseMessage,
  IResponseMessage,
} from '../../utils/response.map';
import { AddFundingRequest } from '../dto/funding-request.dto';
import { RemoveConnectedBankDTO } from '../dto/remove-connected-bank.dto';
import { FinancialInformationServices } from '../services/financial-info.services';

@Controller('financial-information')
@ApiTags('Financial')
export class FinancialInfoController {
  constructor(private readonly financeServices: FinancialInformationServices) {}

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
    const response = await this.financeServices.fetchFundingPartner(
      getFundingPartnerParam,
    );
    return wrapResponseMessage('funding partner found succesfull', response);
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
}
