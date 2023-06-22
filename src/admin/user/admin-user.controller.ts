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
import { GetFundingRequestsParamDTO } from 'src/financial-information/dto/funding-request.dto';
import { Op } from 'sequelize';

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
    const response = await this.userService.getUserSession(req.user);
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

  @Get('dashoboard/data')
  async getDashboards(@Request() req): Promise<IResponseMessage> {
    const response = await this.adminServices.getDashBoardData();
    return wrapResponseMessage('Dashboard data fetched', response);
  }

  @Get('dashoboard/fetchFundRequest')
  async getFundingRequest(@Request() req): Promise<IResponseMessage> {
    const response = await this.adminServices.getDashBoardData();
    return wrapResponseMessage('Dashboard data fetched', response);
  }

  @Get('business/bankStatement/:businessId')
  async getBusinessBankStatemnt(
    @Param('businessId') businessId: string,
  ): Promise<IResponseMessage> {
    const response = await this.financialServices.fetchTransaction(businessId);
    return wrapResponseMessage('Dashboard data fetched', response);
  }

  @Get('/dashboard/general-funding-stats')
  @HttpCode(HttpStatus.OK)
  async getGeneralFundingStatsStats(
    @Query() query: GetFundingRequestsParamDTO,
  ) {
    const { from, to } = query;
    const response =
      await this.financialServices.fetchFundRequestPerformanceStats({
        where: {
          createdAt: {
            [Op.between]: [from, to],
          },
        },
      });
    return wrapResponseMessage(
      'Performance stats retrieved successfully.',
      response,
    );
  }

  @Get('/dashboard/general-funding-request-recent-activity')
  @UseGuards(JwtAuthGuard)
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

  @Get('/dashboard/banks/performance-stats')
  @HttpCode(HttpStatus.OK)
  async getPerformanceStats(@Query() query: GetFundingRequestsParamDTO) {
    const { bankId, from, to } = query;
    const response =
      await this.financialServices.fetchFundRequestPerformanceStats({
        where: {
          bankId,
          createdAt: {
            [Op.between]: [from, to],
          },
        },
      });
    return wrapResponseMessage(
      'Performance stats retrieved successfully.',
      response,
    );
  }

  @Get('/dashboard/banks/funding-request/stats')
  @HttpCode(HttpStatus.OK)
  async getFundingRequestStats(@Query() query: GetFundingRequestsParamDTO) {
    const { bankId, from, to } = query;
    const response =
      await this.financialServices.fetchFundRequestPerformanceStats({
        where: {
          bankId,
          createdAt: {
            [Op.between]: [from, to],
          },
        },
      });
    return wrapResponseMessage('Stats retrieved successfully.', response);
  }

  @Get('/dashboard/banks/funding-requests/')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getFundingRequests(@Query() query: GetFundingRequestsParamDTO) {
    const response = await this.financialServices.fetchFundingRequests(query, {
      where: {
        bankId: query.bankId,
        fundingTransactionStatus: query.status,
        createdAt: {
          [Op.between]: [query.from, query.to],
        },
      },
    });
    return wrapResponseMessage(
      'Funding requests retrieved successfully.',
      response,
    );
  }

  @Get('/dashboard/banks/funding-request-recent-activity/:bank_id')
  @UseGuards(JwtAuthGuard)
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

  @Get('/dashboard/banks/customers/funding-requests-by-bank/stats')
  @HttpCode(HttpStatus.OK)
  async getFundingCustomerStatsByBankId(
    @Query() query: GetCustomerFundingRequestsParamDTO,
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
    @Query() query: GetFundingRequestsParamDTO,
  ) {
    const { bankId, from, to, rows, page, status } = query;
    const response = await this.financialServices.fetchCustomerFundingRequest(
      {
        where: {
          bankId,
          fundingTransactionStatus: status,
          createdAt: {
            [Op.between]: [from, to],
          },
        },
      },
      {
        rows,
        page,
      },
    );

    return wrapResponseMessage(
      'Funding customer requests retrieved successfully.',
      response,
    );
  }

  @Get('/dashboard/customers/funding-customers-requests')
  @HttpCode(HttpStatus.OK)
  async getFundingCustomersRequestsForCustomerDashboard(
    @Query() query: GetFundingRequestsParamDTO,
  ) {
    const { from, to, rows, page, status } = query;
    const response = await this.financialServices.fetchCustomerFundingRequest(
      {
        where: {
          fundingTransactionStatus: status,
          createdAt: {
            [Op.between]: [from, to],
          },
        },
      },
      {
        rows,
        page,
      },
    );

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
    const { bankId, from, to } = query;
    const response = await this.financialServices.fetchFundingCustomerStats({
      where: {
        createdAt: {
          [Op.between]: [from, to],
        },
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
    @Query() query: GetFundingRequestsParamDTO,
  ) {
    const response = await this.financialServices.fetchFundingRequests(query, {
      where: {
        businessEntityId: query.businessId,
        fundingTransactionStatus: query.status,
        createdAt: {
          [Op.between]: [query.from, query.to],
        },
      },
    });
    return wrapResponseMessage(
      'Funding requests retrieved successfully.',
      response,
    );
  }
}
