import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserServices } from 'src/user/services/user.services';
import { PartnerServices } from '../../partner/services';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserServices,
    private readonly partnerService: PartnerServices,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    if (payload.partner_id || payload.login_route === 'partner') {
      const partner = await this.partnerService.findByEmailOrFail(
        payload.email,
      );
      return {
        partnerId: partner.id,
        email: partner.email,
      };
    }

    const user = await this.userService.findByEmailOrFailed(payload.email);
    return { userId: user.id, email: user.email, userType: user.userType };
  }
}
