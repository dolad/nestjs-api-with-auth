import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../../storage/postgres/user.schema';
import {
  FUNDING_REQUEST_TRANSACTION,
  PATNER_REPOSITORY,
} from '../../utils/constants';

import { Partner } from '../../storage/postgres/partner.schema';

import { Op } from 'sequelize';
import { FundingRequestTransaction } from 'src/storage/postgres/fundingTransaction';
import sequelize from 'sequelize';

export type SumQueryResult = {
  fundsIssued: any;
};
export type AdminDashBoardDataParams = {
  allPartners: number;
  allPartnerFunds: number;
  activePartnerFunds?: number;
  inactivePartnerFunds?: number;
  activePartners: number;
  inactivePartners: number;
};

@Injectable()
export class AdminService {
  constructor(
    @Inject(PATNER_REPOSITORY)
    private readonly partnerModel: typeof Partner,
    @Inject(FUNDING_REQUEST_TRANSACTION)
    private readonly fundingTransactionModel: typeof FundingRequestTransaction,
  ) {}

  async getDashBoardData(): Promise<AdminDashBoardDataParams> {
    const allPartners = await this.partnerModel.findAll();
    const activePartners = allPartners
      .filter((partner) => partner.isActive === true)
      .map((item) => item.id);
    const inactivePartners = allPartners
      .filter((partner) => partner.isActive === false)
      .map((item) => item.id);

    const allActiveFundResult = (await this.fundingTransactionModel.findAll({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('issuedAmount')), 'fundsIssued'],
      ],
      where: {
        providerId: {
          [sequelize.Op.in]: activePartners,
        },
      },
      raw: true,
    })) as unknown as SumQueryResult;

    const inActiveFundResult = (await this.fundingTransactionModel.findAll({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('issuedAmount')), 'fundsIssued'],
      ],
      where: {
        providerId: {
          [sequelize.Op.in]: inactivePartners,
        },
      },
      raw: true,
    })) as unknown as SumQueryResult;

    const allFundingResult = (await this.fundingTransactionModel.findAll({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('issuedAmount')), 'fundsIssued'],
      ],

      raw: true,
    })) as unknown as SumQueryResult;

    return {
      allPartners: allPartners.length,
      allPartnerFunds: allFundingResult[0].fundsIssued || 0,
      activePartnerFunds: allActiveFundResult[0].fundsIssued || 0,
      inactivePartnerFunds: inActiveFundResult[0].fundsIssued || 0,
      activePartners: activePartners.length,
      inactivePartners: inactivePartners.length,
    };
  }
}

export function sumArray(arr: number[], index: number) {
  if (index === arr.length) {
    return 0;
  }
  return arr[index] + sumArray(arr, index + 1);
}
