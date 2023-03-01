import {
  Body,
  Controller,
  ParseArrayPipe,
  Post,
  Request,
  UseGuards,
  Get,
  Param,
  Patch,
  HttpCode,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  IResponseMessage,
  wrapResponseMessage,
} from '../../utils/response.map';
import { CreateBusinessEntity, AddBusinessOwnerDto, UpdateBusinessOwnerDto } from '../dto/create-business-owner.dto';
import { BusinessEntityServices } from '../services/business-entity.services';

@Controller('business-entity')
@ApiTags('Business')
export class BusinessEntityController {
  constructor(private readonly businessEntityService: BusinessEntityServices) {}

  @Post('/kyc/stage-1')
  @UseGuards(JwtAuthGuard)
  async createBusinessEntity(
    @Request() req,
    @Body() createBodyPayload: CreateBusinessEntity,
  ): Promise<IResponseMessage> {
    const response = await this.businessEntityService.createBusinessEntity(
      createBodyPayload,
      req.user,
    );
    return wrapResponseMessage(
      'Business entity and Kyc record Created',
      response,
    );
  }

  @Post('/kyc/stage-2')
  @UseGuards(JwtAuthGuard)
  async addBusinessOwner(
    @Request() req,
    @Body(new ParseArrayPipe({ items: AddBusinessOwnerDto }))
    createBodyPayload: AddBusinessOwnerDto[],
  ): Promise<IResponseMessage> {
    const response = await this.businessEntityService.createBusinessOwners(
      createBodyPayload,
      req.user,
    );
    return wrapResponseMessage(
      'Business Owner added and Kyc record created',
      response,
    );
  }

  @Get('/kyc')
  @UseGuards(JwtAuthGuard)
  async getBusinessEntity(
    @Request() req,
  ): Promise<IResponseMessage> {
    const response = await this.businessEntityService.fetchBusinessEntity(
      req.user,
    );
    return wrapResponseMessage(
      'Business entity and Kyc Record Fetched',
      response,
    );
  }

  @Patch('/kyc/updateShareHolders/:shareHolderId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateShareHolders(
    @Param("shareHolderId") shareHolderId: string,
    @Body() updateShareHolderDetails: UpdateBusinessOwnerDto
  ): Promise<IResponseMessage> {
    const response = await this.businessEntityService.updateShareHoldersDetails(
        shareHolderId,
        updateShareHolderDetails
    );
    return wrapResponseMessage(
      'Business entity and Kyc Record Updated Successfully',
      "shareHolderUploaded Successfully",
    );
  }

  @Delete('/kyc/deleteShareHolder/:shareHolderId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteShareHolders(
    @Param("shareHolderId") shareHolderId: string
  ): Promise<IResponseMessage> {
    const response = await this.businessEntityService.deleteShareHoldersDetails(
        shareHolderId);
    return wrapResponseMessage(
      'Business entity and Kyc Record Fetched',
      response,
    );
  }
}
