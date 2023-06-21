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

@Injectable()
export class PartnerServices {
  private logger: Logger = new Logger(PartnerServices.name);
  constructor(
    @Inject(PATNER_REPOSITORY)
    private readonly partnerRepository: typeof Partner,
    private readonly userServices: UserServices,
    private readonly authService: AuthService,
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
}
