import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Op } from 'sequelize';
import { FundingRequest } from 'src/storage/postgres/fundingRequest.schema';
import {
  FundingPartnerResponse,
  GetFundingParterParam,
} from 'src/user/interface/get-funding-partner';
import { UserServices } from 'src/user/services/user.services';

import { BankProvider } from '../../storage/postgres/bank-provider';
import { BankProviderCountries } from '../../storage/postgres/bank-provider-countries';
import { BusinessEntity } from '../../storage/postgres/business-entity.schema';
import { FinancialConnectDetails } from '../../storage/postgres/financial-account';
import { IAuthUser } from '../../user/types/user.types';
import {
  BUSINESS_ENTITY_REPOSITORY,
  FINANCIAL_CONNECT_PROVIDER,
  FUNDING_REQUEST,
  SUPORTED_BANK_PROVIDER,
  SUPORTED_BANK_PROVIDER_COUNTRIES,
} from '../../utils/constants';
import {
  AddFundingRequest,
  GetFundingRequestsParamDTO,
} from '../dto/funding-request.dto';
import { supportedCountryPayload } from '../mockRequest/connection';
import { SaltEdge } from './saltedge.service';
import { getPaginationParams } from '../../utils/pagination';

@Injectable()
export class FinancialInformationServices {
  constructor(
    @Inject(SUPORTED_BANK_PROVIDER_COUNTRIES)
    private readonly supportedCountriesRepo: typeof BankProviderCountries,
    @Inject(SUPORTED_BANK_PROVIDER)
    private readonly supportedBank: typeof BankProvider,
    @Inject(FINANCIAL_CONNECT_PROVIDER)
    private readonly financialSupportRepo: typeof FinancialConnectDetails,
    private readonly saltEdgeServices: SaltEdge,
    @Inject(BUSINESS_ENTITY_REPOSITORY)
    private readonly businessEntityRepo: typeof BusinessEntity,
    private readonly userServices: UserServices,
    @Inject(FUNDING_REQUEST)
    private readonly fundingRequest: typeof FundingRequest,
  ) {}

  /**
   *
   * @returns add to the database supported countries
   */
  async addToSupportedCountries(): Promise<BankProviderCountries[]> {
    return await this.supportedCountriesRepo.bulkCreate(
      supportedCountryPayload,
    );
  }

  async getSupportedBank(): Promise<BankProvider[]> {
    return await this.supportedBank.findAll();
  }

  /**
   *
   * @returns addSupport to database this should not be used unless use want to add more provider
   */
  async addToSupportedBank(): Promise<any> {
    const response = await this.saltEdgeServices.fetchProvider();
    const responsePayload = response.data.data.map((res) => {
      return {
        code: res.code,
        homeUrl: res.home_url,
        logoUrl: res.logo_url,
        loginUrl: res.login_url,
        name: res.name,
      };
    });
    return await this.supportedBank.bulkCreate(responsePayload);
  }

  async getSuppportedCountries(): Promise<BankProviderCountries[]> {
    return await this.supportedCountriesRepo.findAll();
  }

  async connectBankKyc(user: IAuthUser): Promise<any> {
    const businessEntity = await this.businessEntityRepo.findOne({
      where: {
        creator: user.userId,
      },
    });

    if (!businessEntity)
      throw new NotFoundException('User not associated with any business');
    if (businessEntity.kycStep < 2)
      throw new BadRequestException('Please confirm the previos step');
    const response = await this.connectBank(user);
    businessEntity.kycStep = 3;
    businessEntity.save();

    return response;
  }

  async connectBank(user: IAuthUser): Promise<any> {
    const fetchConnectDetails = await this.createLeadsForCustomer(user);
    const response = await this.saltEdgeServices.createLeadSession(
      fetchConnectDetails.saltEdgeCustomerId,
    );
    return {
      connect_url: response.redirect_url,
    };
  }

  async fetchCustomerConnection(user: IAuthUser) {
    // fetch connections
    const getCustomer = await this.createLeadsForCustomer(user);
    const response = await this.saltEdgeServices.fetchConnection(
      getCustomer.saltEdgeCustomerId,
    );
    return response;
  }

  async fetchConnectedBanks(user: IAuthUser) {
    const financialConnect = await this.financialSupportRepo.findOne({
      where: {
        customerEmail: user.email,
      },
    });

    if (!financialConnect) return [];
    const connection = await this.saltEdgeServices.fetchConnection(
      financialConnect.saltEdgeCustomerId,
    );
    const providerName = connection
      .filter((item) => item.status === 'active')
      .map((item) => item.provider_name);

    const provider = await this.supportedBank.findAll({
      where: {
        name: {
          [Op.in]: providerName,
        },
      },
    });

    return provider;
  }

  async disableBankConnection(user: IAuthUser, bankName: string) {
    const financialConnect = await this.financialSupportRepo.findOne({
      where: {
        customerEmail: user.email,
      },
    });
    if (!financialConnect) {
      throw new NotFoundException('User does not have any connected Banks');
    }
    const connections = await this.saltEdgeServices.fetchConnection(
      financialConnect.saltEdgeCustomerId,
    );
    const providerConnectionDetails = connections.filter(
      (item) => item.status === 'active' && item.provider_name === bankName,
    );
    const consents = await this.saltEdgeServices.getConsentWithConnectionId(
      providerConnectionDetails[0].id,
    );
    await this.saltEdgeServices.revokeConsent(
      consents[0].id,
      consents[0].connection_id,
    );
    await this.financialSupportRepo.destroy({
      where: {
        customerEmail: user.email,
      },
    });
    return 'Successfully disconnect bank';
  }

  async fetchAccount(user: IAuthUser) {
    // fetch connections
    const connection = await this.fetchCustomerConnection(user);
    const response = await this.saltEdgeServices.fetchAccounts(connection.id);
    return response.data.data;
    // fetchaccount from connections
  }

  async fetchTransaction(user: IAuthUser) {
    // fetch connections
    const connection = await this.fetchCustomerConnection(user);
    const account = await this.fetchAccount(user);
    const response = await this.saltEdgeServices.fetchTransaction(
      connection.id,
      account.id,
    );
    return response;
    // fetchaccount from connections
  }

  async createFundingRequest(
    user: IAuthUser,
    fundingRequirement: AddFundingRequest,
  ): Promise<any> {
    const businessId = await this.businessEntityRepo.findOne({
      where: {
        creator: user.userId,
      },
    });
    if (!businessId) {
      throw new NotFoundException(
        'User is not attached to a buisiness account',
      );
    }

    const request = await this.fundingRequest.create({
      ...fundingRequirement,
      businessEntityId: businessId.id,
    });

    return request;
  }

  private async createLeadsForCustomer(user: IAuthUser): Promise<any> {
    const financialConnectExist = await this.financialSupportRepo.findOne({
      where: {
        customerEmail: user.email,
        customerId: user.userId,
      },
    });

    if (financialConnectExist) {
      return financialConnectExist;
    }
    const businessId = await this.businessEntityRepo.findOne({
      where: {
        creator: user.userId,
      },
    });

    if (!businessId) {
      throw new BadRequestException(
        'This user have register a business with us',
      );
    }

    const createSaltEdgeCustomer = await this.saltEdgeServices.createLeads(
      user.email,
    );

    const payload = createSaltEdgeCustomer.data.data;
    return await this.financialSupportRepo.create({
      saltEdgeCustomerId: payload.customer_id,
      saltCustomerSecret: payload.customer_id,
      saltEdgeIdentifier: payload.email,
      customerEmail: user.email,
      customerId: user.userId,
      businessId: businessId.id,
    });
  }

  async fetchFundingPartner(
    payload: GetFundingParterParam,
  ): Promise<FundingPartnerResponse> {
    const fundingPatner = await this.userServices.fetchFundingPartner(payload);
    return fundingPatner;
  }

  async fetchFundRequestPerformanceStats(
    bankId: string,
    from: Date,
    to: Date,
  ): Promise<{
    totalAmountRequested: number;
    totalAmountIssued: number;
    totalAmountDeclined: number;
    totalAmountPending: number;
  }> {
    const response = await this.fundingRequest.findAll({
      where: {
        bankId,
        createdAt: {
          [Op.between]: [from, to],
        },
      },
      include: [
        {
          model: this.businessEntityRepo,
          as: 'businessEntity',
        },
      ],
    });

    const totalAmountRequested = response.reduce((acc, item) => {
      const fundingAmount = item.fundingAmount ?? 0;
      return acc + fundingAmount;
    }, 0);

    const totalAmountIssued = response.reduce((acc, item) => {
      const issuedAmount = item.issuedAmount ?? 0;
      return acc + issuedAmount;
    }, 0);

    const totalAmountDeclined = response.reduce((acc, item) => {
      //check if the item is declined
      if (item.fundingTransactionStatus === 'declined') {
        const fundingAmount = item.fundingAmount ?? 0;
        return acc + fundingAmount;
      }
    }, 0);

    const totalAmountPending = response.reduce((acc, item) => {
      //check if the item is declined
      if (item.fundingTransactionStatus === 'pending') {
        const fundingAmount = item.fundingAmount ?? 0;
        return acc + fundingAmount;
      }
    }, 0);

    return {
      totalAmountRequested,
      totalAmountIssued,
      totalAmountDeclined,
      totalAmountPending,
    };
  }

  async fetchFundingRequestRecentActivities(
    bankId: string,
  ): Promise<FundingRequest[]> {
    const response = await this.fundingRequest.findAll({
      where: {
        bankId,
      },
      include: [
        {
          model: this.businessEntityRepo,
          as: 'businessEntity',
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: 10,
    });
    return response;
  }

  async fetchFundingRequests(payload: GetFundingRequestsParamDTO): Promise<{
    page: number;
    totalPages: number;
    rows: FundingRequest[];
    count: number;
  }> {
    const { rows, offset, page } = getPaginationParams({
      rows: payload.rows,
      page: payload.page,
    });

    const options = {
      where: {
        bankId: payload.bankId,
        createdAt: {
          [Op.between]: [payload.from, payload.to],
        },
      },
      include: [
        {
          model: this.businessEntityRepo,
          as: 'businessEntity',
        },
      ],
      offset,
      limit: rows,
    };

    const response = await this.fundingRequest.findAndCountAll(options);

    const totalPages = Math.ceil(response.count / rows) || 0;

    return {
      page,
      totalPages,
      rows: response.rows,
      count: response.count,
    };
  }

  async fetchFundingCustomerStats(bankId: string, from: Date, to: Date) {
    //fetch funding request with distinct business entity
    const fundingRequest = await this.fundingRequest.findAll({
      where: {
        bankId,
        createdAt: {
          [Op.between]: [from, to],
        },
      },
      include: [
        {
          model: this.businessEntityRepo,
          as: 'businessEntity',
        },
      ],
      attributes: ['businessEntityId'],
      group: ['businessEntityId'],
    });

    const totalPending = fundingRequest.reduce((acc, item) => {
      if (item.fundingTransactionStatus === 'pending') {
        return acc + 1;
      }
      return acc;
    }, 0);

    return {
      totalPendingCustomers: totalPending,
      totalCustomers: fundingRequest.length,
    };
  }

  async fetchCustomerFundingRequest(payload: GetFundingRequestsParamDTO) {
    const { rows, offset, page } = getPaginationParams({
      rows: payload.rows,
      page: payload.page,
    });

    //get all funding request
    //count number of funding request of each customer
    const options = {
      where: {
        bankId: payload.bankId,
        createdAt: {
          [Op.between]: [payload.from, payload.to],
        },
      },
      include: [
        {
          model: this.businessEntityRepo,
          as: 'businessEntity',
        },
      ],

      offset,
      limit: rows,
    };

    const response = await this.businessEntityRepo.findAndCountAll(options);

    const totalPages = Math.ceil(response.count / rows) || 0;

    return {
      page,
      totalPages,
      rows: response.rows,
      count: response.count,
    };
  }
}
