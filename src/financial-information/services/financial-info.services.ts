import {
  BadRequestException,
  ConsoleLogger,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Op } from 'sequelize';
import { FundingRequirement } from 'src/storage/postgres/financial-requirement';
import { FundingRequest } from 'src/storage/postgres/fundingRequest.schema';
import { Partner } from 'src/storage/postgres/partner.schema';
import {
  FundingPartnerResponse,
  GetFundingParterParam,
} from 'src/user/interface/get-funding-partner';
import { UserServices } from 'src/user/services/user.services';
import {
  getPaginationParams,
  PaginationParamsInput,
} from 'src/utils/pagination';
import { BankProvider } from '../../storage/postgres/bank-provider';
import { BankProviderCountries } from '../../storage/postgres/bank-provider-countries';
import { BusinessEntity } from '../../storage/postgres/business-entity.schema';
import { FinancialConnectDetails } from '../../storage/postgres/financial-account';
import { IAuthUser } from '../../user/types/user.types';
import {
  BUSINESS_ENTITY_REPOSITORY,
  FINANCIAL_CONNECT_PROVIDER,
  FINANCIAL_REQUIREMENT,
  PATNER_REPOSITORY,
  SUPORTED_BANK_PROVIDER,
  SUPORTED_BANK_PROVIDER_COUNTRIES,
} from '../../utils/constants';
import { AddFundingRequest } from '../dto/funding-request.dto';
import { supportedCountryPayload } from '../mockRequest/connection';
import { SaltEdge } from './saltedge.service';

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
    @Inject(FINANCIAL_REQUIREMENT)
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
      throw new NotFoundException('Business not Found');
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
}
