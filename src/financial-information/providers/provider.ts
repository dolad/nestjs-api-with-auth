import { BankProvider } from 'src/storage/postgres/bank-provider';
import { FundingRequirement } from 'src/storage/postgres/financial-requirement';
import { BankProviderCountries } from '../../storage/postgres/bank-provider-countries';
import { FinancialConnectDetails } from '../../storage/postgres/financial-account';
import {
  FINANCIAL_CONNECT_PROVIDER,
  FINANCIAL_REQUIREMENT,
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
        provide: FINANCIAL_REQUIREMENT,
        useValue: FundingRequirement
      }

]
