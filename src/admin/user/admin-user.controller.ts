import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Get,
  Param,
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminRouteGuard } from '../../auth/guards/admin.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  IResponseMessage,
  wrapResponseMessage,
} from '../../utils/response.map';
import { UserServices } from '../../user/services/user.services';
import {
  ChangePasswordPayload,
  UpdateCreatorDetails,
} from '../../user/dto/update-user-password.dto';
import { EnabledTwoFaAuthPayload } from '../../user/dto/enable-2fa.dto';
import { AddUserToBusinessEntity } from 'src/user/dto/add-user.dto';
import { AddPatnerDTO } from './dto/add-bank.dto';
import { UpdatePatnerInformationDTO } from './dto/updateProvider.dto';
import { AdminService } from './admin-user.services';
import { FinancialInformationServices } from 'src/financial-information/services/financial-info.services';
import { GetCustomerFundingRequestsParamDTO } from 'src/financial-information/dto/performance-stat-dto';
import {
  GetFundingRequestsByBankIdDTO,
  GetFundingRequestsByBankIdStatDTO,
  GetFundingRequestsByBusinessIdDTO,
  GetFundingRequestsParamDTO,
} from 'src/financial-information/dto/funding-request.dto';
import { Op } from 'sequelize';
import { query } from 'express';
import { GetCustomerInformationDto } from './dto/fetchBusinessInfoDto';

@Controller('admin-user')
@ApiTags('AdminUser')
@UseGuards(JwtAuthGuard, AdminRouteGuard)
export class AdminUserController {
  constructor(
    private readonly userService: UserServices,
    private readonly adminServices: AdminService,
    private readonly financialServices: FinancialInformationServices,
  ) {}

  @Post('change-password')
  async changeUserPassword(
    @Request() req,
    @Body() payload: ChangePasswordPayload,
  ): Promise<IResponseMessage> {
    const response = await this.userService.changePassword(payload, req.user);
    return wrapResponseMessage('Password Changed Successfully', response);
  }

  @Post('enable-two-fa')
  async enableTwoFa(
    @Request() req,
    @Body() payload: EnabledTwoFaAuthPayload,
  ): Promise<IResponseMessage> {
    const response = await this.userService.enableTwoFaAuth(
      req.user,
      payload.type,
    );
    return wrapResponseMessage('twoFactorAuthentication enabled', response);
  }

  @Get('sessions')
  async getUserSession(@Request() req): Promise<IResponseMessage> {
    const response = await this.userService.getUserSession(req.user.userId);
    return wrapResponseMessage('Admin Session Fetched', response);
  }

  @Post('update')
  async updateDetails(
    @Request() req,
    @Body() payload: UpdateCreatorDetails,
  ): Promise<IResponseMessage> {
    const response = await this.userService.updateCreatorDetails(
      payload,
      req.user,
    );
    return wrapResponseMessage(' Admin details updated', response);
  }

  @Post('add-admins')
  async addAdminUser(
    @Request() req,
    @Body() payload: AddUserToBusinessEntity,
  ): Promise<IResponseMessage> {
    const response = await this.userService.addAdminUser(payload);
    return wrapResponseMessage('Admin user Created', response);
  }

  @Get('get-admins')
  async getAdminUser(@Request() req): Promise<IResponseMessage> {
    const response = await this.userService.getAdminUsers();
    return wrapResponseMessage('Admin user successfully fetched', response);
  }

  @Post('add-partner')
  async addPartner(@Body() payload: AddPatnerDTO): Promise<IResponseMessage> {
    const response = await this.userService.addPatner(payload);
    return wrapResponseMessage('Partner user Created', response);
  }

  @Post('update-partner-informations/:partnerId')
  async updatePartnerInformation(
    @Body() payload: UpdatePatnerInformationDTO,
    @Param('partnerId') partnerId: string,
  ): Promise<IResponseMessage> {
    const response = await this.userService.updatePartnerInformation(
      payload,
      partnerId,
    );
    return wrapResponseMessage('Partner user updated', response);
  }

  @Get('dashboard/data')
  async getDashboards(@Request() req): Promise<IResponseMessage> {
    const response = await this.adminServices.getDashBoardData();
    return wrapResponseMessage('Dashboard data fetched', response);
  }

  @Get('dashboard/fetchFundRequest')
  async getFundingRequest(@Request() req): Promise<IResponseMessage> {
    const response = await this.adminServices.getDashBoardData();
    return wrapResponseMessage('Dashboard data fetched', response);
  }

  @Get('business/documents/:businessId')
  async getBusinessBankStatemnt(
    @Param('businessId') businessId: string,
  ): Promise<IResponseMessage> {
    const response = await this.financialServices.getBusinessBankStatement(
      businessId,
    );
    return wrapResponseMessage('Bank Statement data fetched', response);
  }

  @Get('/dashboard/general-funding-stats')
  @HttpCode(HttpStatus.OK)
  async getGeneralFundingStatsStats(
    @Query() query: GetFundingRequestsParamDTO,
  ) {
    const response =
      await this.financialServices.fetchFundRequestPerformanceStats(query);
    return wrapResponseMessage(
      'Performance stats retrieved successfully.',
      response,
    );
  }

  @Get('/dashboard/general-funding-request-recent-activity')
  @HttpCode(HttpStatus.OK)
  async getGeneralFundingRequestRecentActivity(): Promise<any> {
    const response =
      await this.financialServices.fetchFundingRequestRecentActivities({
        where: {},
      });

    return wrapResponseMessage(
      'Recent activities retrieved successfully.',
      response,
    );
  }

  @Get('/dashboard/banks/funding-request/stats')
  @HttpCode(HttpStatus.OK)
  async getFundingRequestStats(@Query() query: GetFundingRequestsParamDTO) {
    const response =
      await this.financialServices.fetchFundRequestPerformanceStats(query);

    return wrapResponseMessage('Stats retrieved successfully.', response);
  }

  @Get('/dashboard/banks/funding-requests/')
  @HttpCode(HttpStatus.OK)
  async getFundingRequests(@Query() query: GetFundingRequestsParamDTO) {
    const whereOption = {};

    if (query.from && query.to) {
      whereOption['createdAt'] = {
        [Op.between]: [query.from, query.to],
      };
    }

    if (query.status) {
      whereOption['fundingTransactionStatus'] = query.status;
    }

    if (query.bankId) {
      whereOption['bankId'] = query.bankId;
    }

    const response = await this.financialServices.fetchFundingRequests(query, {
      where: whereOption,
    });
    return wrapResponseMessage(
      'Funding requests retrieved successfully.',
      response,
    );
  }

  @Get('/dashboard/banks/funding-request-recent-activity/:bank_id')
  @HttpCode(HttpStatus.OK)
  async getFundingRequestRecentActivity(
    @Param('bank_id') bankId: string,
  ): Promise<any> {
    const response =
      await this.financialServices.fetchFundingRequestRecentActivities({
        where: {
          bankId,
        },
      });

    return wrapResponseMessage(
      'Recent activities retrieved successfully.',
      response,
    );
  }

  @Get('/dashboard/banks/:bank_id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getBankInformation(@Param('bank_id') bankId: string): Promise<any> {
    const response = await this.adminServices.fetchPartnerInformation(bankId);

    return wrapResponseMessage(
      'Bank information retrieved successfully.',
      response,
    );
  }

  @Get('/dashboard/banks/performance-stat/funds-graph-data/:bank_id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getGraphDataForFundingRequest(
    @Param('bank_id') bankId: string,
  ): Promise<any> {
    const response = await this.adminServices.getGraphDataForFundingRequest(
      bankId,
    );

    return wrapResponseMessage(
      'Bank information retrieved successfully.',
      response,
    );
  }

  @Get('/dashboard/banks/performance-stat/requests-graph-data/:bank_id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getGraphDataForRequest(@Param('bank_id') bankId: string): Promise<any> {
    const response = await this.adminServices.getGraphDataForRequest(bankId);

    return wrapResponseMessage(
      'Bank information retrieved successfully.',
      response,
    );
  }

  @Get('/dashboard/banks/customers/funding-requests-by-bank/stats')
  @HttpCode(HttpStatus.OK)
  async getFundingCustomerStatsByBankId(
    @Query() query: GetFundingRequestsByBankIdStatDTO,
  ) {
    const { bankId } = query;
    const response = await this.financialServices.fetchFundingCustomerStats({
      where: {
        bankId,
      },
    });

    return wrapResponseMessage(
      'Funding customer stats retrieved successfully.',
      response,
    );
  }

  @Get('/dashboard/banks/customers/funding-requests-by-bank')
  @HttpCode(HttpStatus.OK)
  async getFundingCustomersRequests(
    @Query() query: GetFundingRequestsByBankIdDTO,
  ) {
    const response =
      await this.financialServices.fetchFundingRequestGroupedByCustomer(query);

    return wrapResponseMessage(
      'Funding customer requests retrieved successfully.',
      response,
    );
  }

  @Get('/dashboard/customers/overview/funding-request')
  @HttpCode(HttpStatus.OK)
  async getFundingCustomersRequestsForCustomerDashboard(
    @Query() query: GetFundingRequestsParamDTO,
  ) {
    const response =
      await this.financialServices.fetchFundingRequestGroupedByCustomer(query);

    return wrapResponseMessage(
      'Funding customer requests retrieved successfully.',
      response,
    );
  }

  @Get('/dashboard/customers/funding-customers-stats')
  @HttpCode(HttpStatus.OK)
  async getFundingCustomersStats(
    @Query() query: GetCustomerFundingRequestsParamDTO,
  ) {
    const { from, to, businessId } = query;
    const queryOption = {};

    if (from && to) {
      queryOption['createdAt'] = {
        [Op.between]: [from, to],
      };
    }

    if (query.businessId) {
      queryOption['businessEntityId'] = query.businessId;
    }
    const response = await this.financialServices.fetchFundingCustomerStats({
      where: {
        ...queryOption,
      },
    });

    return wrapResponseMessage(
      'Funding customer stats retrieved successfully.',
      response,
    );
  }

  @Get('/dashboard/customers/funding-requests-by-business-id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getFundingRequestsByBusiness(
    @Query() query: GetFundingRequestsByBusinessIdDTO,
  ) {
    const filter = {};

    if (query.from && query.to) {
      filter['createdAt'] = {
        [Op.between]: [query.from, query.to],
      };
    }

    if (query.status) {
      filter['fundingTransactionStatus'] = query.status;
    }

    if (query.bankId) {
      filter['bankId'] = query.bankId;
    }

    if (query.businessId) {
      filter['businessEntityId'] = query.businessId;
    }

    const response = await this.financialServices.fetchFundingRequests(query, {
      where: {
        ...filter,
      },
    });
    return wrapResponseMessage(
      'Funding requests retrieved successfully.',
      response,
    );
  }

  @Get('/dashboard/customers/business-information/')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getBusinessInformationById(@Query() query: GetCustomerInformationDto) {
    const response =
      await this.financialServices.fetchFundingRequestsByBusinessId(query);
    return wrapResponseMessage(
      'Funding requests retrieved successfully.',
      response,
    );
  }

  @Get('/dashboard/customers/get-business-details')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getBusinessInfoDetail(@Query('businessId') businessId: string) {
    const response = await this.financialServices.fetchBusinessInformation(
      businessId,
    );
    return wrapResponseMessage(
      'Business requests retrieved successfully.',
      response,
    );
  }

  @Get('/dashboard/customers/get-business-details/owner-details')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async fetchBusinesOwnerDetails(@Query('businessId') businessId: string) {
    const response = await this.financialServices.fetchBusinesOwnerDetails(
      businessId,
    );
    return wrapResponseMessage(
      'Business requests retrieved successfully.',
      response,
    );
  }
}
