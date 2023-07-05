import { BankProvider } from 'src/storage/postgres/bank-provider';
import { FundingRequest } from 'src/storage/postgres/fundingRequest.schema';
import { BankProviderCountries } from '../../storage/postgres/bank-provider-countries';
import { FinancialConnectDetails } from '../../storage/postgres/financial-connects';
import {
  FINANCIAL_CONNECT_PROVIDER,
  FUNDING_REQUEST,
  SUPORTED_BANK_PROVIDER,
  SUPORTED_BANK_PROVIDER_COUNTRIES,
} from '../../utils/constants';

export const financialInfoProviders = [
  {
    provide: SUPORTED_BANK_PROVIDER_COUNTRIES,
    useValue: BankProviderCountries,
  },
  {
    provide: SUPORTED_BANK_PROVIDER,
    useValue: BankProvider,
  },
  {
    provide: FINANCIAL_CONNECT_PROVIDER,
    useValue: FinancialConnectDetails,
  },

  {
    provide: FUNDING_REQUEST,
    useValue: FundingRequest,
  },
];
