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
import { UpdateBusinessInformationDTO } from '../dto/business-info.dto';
import { BusinessInformationServices } from '../services/business-info.services';

@Controller('business-information')
@ApiTags('Business')
export class BusinessInfoController {
  constructor(private readonly businessInfo: BusinessInformationServices) {}

  @Post('/kyc/stage-2')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async addBusinessInfo(
  ): Promise<IResponseMessage> {
   
    return wrapResponseMessage('business Information Successfully', "not implemented");
  }

  @Post('/update')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async updateBusinessInformation(@Body() payload: UpdateBusinessInformationDTO
  ): Promise<IResponseMessage> {
    const response = await this.businessInfo.update(payload)
    return wrapResponseMessage('business Information Successfully', "updated");
  }

}
