import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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
import { SoftwareInformationServices } from '../services/software-info.services';

@Controller('software-information')
@ApiTags('Software')
export class SoftwareInfoController {
  constructor(private readonly softwareServices: SoftwareInformationServices) {}

  @Post('connect/:token')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async connectBankProvider(@Request() req, @Param('token') token: string
  ): Promise<IResponseMessage> {
    const response = await this.softwareServices.connect(req.user, token);
    return wrapResponseMessage('business Information Successfully', response);
  }

  @Post('connected-softwares')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async connectedSoftware(@Request() req): Promise<IResponseMessage> {
    const response = await this.softwareServices.connectedSoftwares(req.user);
    return wrapResponseMessage('Connected Softwares Fetched Succesfully', response);
  }
}
