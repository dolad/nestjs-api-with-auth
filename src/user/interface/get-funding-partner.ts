import { Partner } from 'src/storage/postgres/partner.schema';

export interface GetFundingParterParam {
  rows?: number;
  page?: number;
  businessType?: string;
}

export interface FundingPartnerResponse {
  page: number;
  rows: Partner[];
  count: number;
  totalPages: number;
}
