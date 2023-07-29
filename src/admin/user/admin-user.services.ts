import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FUNDING_REQUEST, PATNER_REPOSITORY } from '../../utils/constants';
import { Partner } from '../../storage/postgres/partner.schema';

import sequelize, { QueryTypes } from 'sequelize';
import { FundingRequest } from 'src/storage/postgres/fundingRequest.schema';
import { formatToMonth } from 'src/utils/formatDateToYear';

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

export type GraphDataFundingResponse = {
  month: string;
  totalFundingAmount: number;
  totalIssuedAmount: number;
};

export type GraphDataResponseResponse = {
  month: string;
  totalRequest: number;
  approvedRequest: number;
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
        [sequelize.fn('SUM', sequelize.col('fundingAmount')), 'fundsIssued'],
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
        [sequelize.fn('SUM', sequelize.col('fundingAmount')), 'fundsIssued'],
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
        [sequelize.fn('SUM', sequelize.col('fundingAmount')), 'fundsIssued'],
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

  async fetchPartnerInformation(partnerId: string) {
    return await this.partnerModel
      .scope('removeSensitivePayload')
      .findByPk(partnerId);
  }

  async getGraphDataForFundingRequest(
    partnerId: string,
  ): Promise<GraphDataFundingResponse[]> {
    const results = await this.fundingRequest.findAll({
      attributes: [
        [
          sequelize.fn('date_trunc', 'month', sequelize.col('createdAt')),
          'month',
        ],
        [
          sequelize.fn('sum', sequelize.col('fundingAmount')),
          'totalFundingAmount',
        ],
        [
          sequelize.fn('sum', sequelize.col('issuedAmount')),
          'totalIssuedAmount',
        ],
      ],
      where: {
        bankId: partnerId,
      },
      group: [sequelize.fn('date_trunc', 'month', sequelize.col('createdAt'))],
      order: [sequelize.fn('date_trunc', 'month', sequelize.col('createdAt'))],
    });

    const fundingRequests = results.map((result) =>
      result.get(),
    ) as unknown as GraphDataFundingResponse[];

    const convertToMonthly: GraphDataFundingResponse[] = fundingRequests.map(
      (result) => {
        return {
          month: formatToMonth(result.month),
          totalFundingAmount: result.totalFundingAmount || 0,
          totalIssuedAmount: result.totalIssuedAmount || 0,
        };
      },
    );
    return convertToMonthly;
  }

  async getGraphDataForRequest(
    partnerId: string,
  ): Promise<GraphDataResponseResponse[]> {
    const results = await this.fundingRequest.findAll({
      attributes: [
        [
          sequelize.fn('date_trunc', 'month', sequelize.col('createdAt')),
          'month',
        ],
        [
          sequelize.fn(
            'count',
            sequelize.literal(
              `CASE WHEN "fundingTransactionStatus" = 'approved' THEN 1 ELSE NULL END`,
            ),
          ),
          'approvedTransaction',
        ],
        [sequelize.fn('count', sequelize.col('id')), 'totalRequest'],
      ],
      where: {
        bankId: partnerId,
      },
      group: [sequelize.fn('date_trunc', 'month', sequelize.col('createdAt'))],
      order: [sequelize.fn('date_trunc', 'month', sequelize.col('createdAt'))],
    });

    const fundingRequests = results.map((result) =>
      result.get(),
    ) as unknown as GraphDataResponseResponse[];

    const convertToMonthly: GraphDataResponseResponse[] = fundingRequests.map(
      (result) => {
        return {
          month: formatToMonth(result.month),
          totalRequest: result.totalRequest || 0,
          approvedRequest: result.approvedRequest || 0,
        };
      },
    );
    return convertToMonthly;
  }
}
