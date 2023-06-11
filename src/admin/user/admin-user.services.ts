import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FUNDING_REQUEST, PATNER_REPOSITORY } from '../../utils/constants';
import { Partner } from '../../storage/postgres/partner.schema';

import sequelize from 'sequelize';
import { FundingRequest } from 'src/storage/postgres/fundingRequest.schema';

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
    @Inject(FUNDING_REQUEST)
    private readonly fundingRequest: typeof FundingRequest,
  ) {}

  async getDashBoardData(): Promise<AdminDashBoardDataParams> {
    const allPartners = await this.partnerModel.findAll();
    const activePartners = allPartners
      .filter((partner) => partner.isActive === true)
      .map((item) => item.id);
    const inactivePartners = allPartners
      .filter((partner) => partner.isActive === false)
      .map((item) => item.id);

    const allActiveFundResult = (await this.fundingRequest.findAll({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('issuedAmount')), 'fundsIssued'],
      ],
      where: {
        bankId: {
          [sequelize.Op.in]: activePartners,
        },
      },
      raw: true,
    })) as unknown as SumQueryResult;

    const inActiveFundResult = (await this.fundingRequest.findAll({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('issuedAmount')), 'fundsIssued'],
      ],
      where: {
        bankId: {
          [sequelize.Op.in]: inactivePartners,
        },
      },
      raw: true,
    })) as unknown as SumQueryResult;

    const allFundingResult = (await this.fundingRequest.findAll({
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
