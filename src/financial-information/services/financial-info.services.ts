import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { BankProvider } from 'src/storage/postgres/bank-provider';
import { BankProviderCountries } from 'src/storage/postgres/bank-provider-countries';
import { FinancialConnectDetails } from 'src/storage/postgres/financial-account';
import { IAuthUser } from 'src/user/types/user.types';
import {
  FINANCIAL_CONNECT_PROVIDER,
  SUPORTED_BANK_PROVIDER,
  SUPORTED_BANK_PROVIDER_COUNTRIES,
} from '../../utils/constants';
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
    const response = await this.saltEdgeServices.fetchProvider('AE');
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

  async connectBank(user: IAuthUser): Promise<any> {
    // create customer and customerTable;
    // create connection;
    // fetch Account and Transaction;
    const fetchConnectDetails = await this.createSaltEdgeCustomer(user);
    const response = await this.saltEdgeServices.createConnectionSession(
      fetchConnectDetails.saltEdgeCustomerId,
    );
    return response.data.data;
  }

  async fetchCustomerConnection(user: IAuthUser) {
    // fetch connections
    const getCustomer = await this.createSaltEdgeCustomer(user);
    const response = await this.saltEdgeServices.fetchConnection(
      getCustomer.saltEdgeCustomerId,
    );
    return response.data.data;
    // fetchaccount from connections
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

  private async createSaltEdgeCustomer(
    user: IAuthUser,
  ): Promise<FinancialConnectDetails> {
    const financialConnectExist = await this.financialSupportRepo.findOne({
      where: {
        customerEmail: user.email,
        customerId: user.userId,
      },
    });
    if (financialConnectExist) {
      return financialConnectExist;
    }
    const createSaltEdgeCustomer = await this.saltEdgeServices.createCustomer(
      user.email,
    );
    const payload = createSaltEdgeCustomer.data.data;
    return await this.financialSupportRepo.create({
      saltEdgeCustomerId: payload.id,
      saltCustomerSecret: payload.secret,
      saltEdgeIdentifier: payload.identifier,
      customerEmail: user.email,
      customerId: user.userId,
    });
  }
}
