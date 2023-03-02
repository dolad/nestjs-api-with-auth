import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  wrapResponseMessage,
  IResponseMessage,
} from '../../utils/response.map';
import { CreateFinancialInformationDTO } from '../dto/financial-info.dto';
import { FinancialInformationServices } from '../services/financial-info.services';

@Controller('financial-information')
@ApiTags('Financial')
export class FinancialInfoController {
  constructor(private readonly financeServices: FinancialInformationServices) {}

  @Get('/fetch-provider-countries')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getSupportedCountries(
  ): Promise<IResponseMessage> {
    const response = await this.financeServices.getSuppportedCountries();
    return wrapResponseMessage('business Information Successfully', response);
  }

  @Get('/fetch-provider')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getSupportedBankProvider(
  ): Promise<IResponseMessage> {
    const response = await this.financeServices.getSupportedBank();
    return wrapResponseMessage('business Information Successfully', response);
  }

  @Post('/connect')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async connectBankProvider(@Request() req
  ): Promise<IResponseMessage> {
    const response = await this.financeServices.connectBank(req.user);
    
    return wrapResponseMessage('business Information Successfully', response);
  }
}
