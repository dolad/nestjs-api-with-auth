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
import { CreateBusinessInformationDTO } from '../dto/business-info.dto';
import { BusinessInformationServices } from '../services/business-info.services';

@Controller('business-information')
@ApiTags('Business')
export class BusinessInfoController {
  constructor(private readonly businessInfo: BusinessInformationServices) {}

  @Post('/kyc/stage-2')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async addBusinessInfo(
    @Body() createBodyPayload: CreateBusinessInformationDTO,
  ): Promise<IResponseMessage> {
    const response = await this.businessInfo.create(createBodyPayload);
    return wrapResponseMessage('business Information Successfully', response);
  }
}
