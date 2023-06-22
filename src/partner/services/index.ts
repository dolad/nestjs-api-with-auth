import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { PATNER_REPOSITORY } from '../../utils/constants';
import { Partner } from '../../storage/postgres/partner.schema';
import { UserServices } from '../../user/services/user.services';
import { AuthService } from '../../auth/services/auth.services';
import { HashManager } from '../../auth/utils/hash';
import { FinancialInformationServices } from '../../financial-information/services/financial-info.services';
import { Op } from 'sequelize';

@Injectable()
export class PartnerServices {
  private logger: Logger = new Logger(PartnerServices.name);
  constructor(
    @Inject(PATNER_REPOSITORY)
    private readonly partnerRepository: typeof Partner,
    private readonly authService: AuthService,
    private readonly financialServices: FinancialInformationServices,
  ) {}

  async login(email: string, password: string) {
    const partner = await this.partnerRepository.findOne({
      where: {
        email,
      },
    });

    if (!partner) {
      throw new UnauthorizedException('invalid email or password');
    }

    const isPasswordCorrect = await partner.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('invalid email or password');
    }

    this.logger.log('partner login successful');

    // return await this.partnerRepository
    //   .scope('removeSensitivePayload')
    //   .findByPk(partner.id);

    return {
      email,
      partner_id: partner.id,
      token: await this.authService.generateAccessToken({
        email,
        partner_id: partner.id,
        login_route: 'partner',
      }),
    };
  }

  async updatePassword(partnerId: string, password: string) {
    const hashManager = new HashManager();
    const hashed_password = await hashManager.bHash(password);
    await this.partnerRepository.update(
      {
        password,
      },
      {
        where: {
          id: partnerId,
        },
      },
    );

    return 'partner password Updated';
  }

  async findByEmailOrFail(email: string) {
    const partner = await this.partnerRepository.findOne({
      where: {
        email,
      },
    });

    if (!partner) {
      throw new UnauthorizedException('partner not found');
    }

    return partner;
  }

  async performanceStats(partnerId: string, from: string, to: string) {
    const response =
      await this.financialServices.fetchFundRequestPerformanceStats({
        where: {
          bankId: partnerId,
          createdAt: {
            [Op.between]: [from, to],
          },
        },
      });
    return response;
  }

  async fundingRecentActivities(partnerId: string) {
    const response =
      await this.financialServices.fetchFundingRequestRecentActivities({
        where: {
          bankId: partnerId,
        },
      });
    return response;
  }
}
