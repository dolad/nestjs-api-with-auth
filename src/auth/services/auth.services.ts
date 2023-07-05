import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/storage/postgres/user.schema';
import {
  PATNER_REPOSITORY,
  USER_REPOSITORY,
  USER_SESSION,
} from '../../utils/constants';
import { RegistrationDTO } from '../dtos/registration.dto';
import { CreateSessionDto, LoginDTO } from '../dtos/login.dto';
import { LoginOutput } from '../types/loginOut.type';
import { JwtService } from '@nestjs/jwt';
import { IEmailNotification } from '../../notification/interface/email-notification.interface';
import { ConfigService } from '@nestjs/config';
import { GoogleUserSignInPayload } from '../types/google.type';
import { UserServices } from '../../user/services/user.services';
import { GoogleSignDto } from '../dtos/google-signin-dto';
import { googleOathVerify } from './google-oath-service';
import { UpdatePasswordDTO } from '../dtos/resendRegistration.dto';
import { HashManager } from '../utils/hash';
import { UserSession } from '../../storage/postgres/user-session.schema';
import { SessionTypeParams } from '../types/session.types';
import {
  IAuthUser,
  UserSession as SessionParams,
} from 'src/user/types/user.types';
import { v4 as uuidv4 } from 'uuid';
import { NotificationService } from 'src/notification/notification.service';
import { Partner } from 'src/storage/postgres/partner.schema';

@Injectable()
export class AuthService {
  private logger: Logger = new Logger(AuthService.name);
  constructor(
    @Inject(USER_REPOSITORY) private userRepos: typeof User,
    @Inject(USER_SESSION) private userSession: typeof UserSession,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    @Inject(forwardRef(() => UserServices))
    private readonly userService: UserServices,
    private readonly notificationService: NotificationService,
    @Inject(PATNER_REPOSITORY)
    private readonly partnerModel: typeof Partner,
  ) {}

  async register(payload: RegistrationDTO): Promise<string> {
    const isRegistered = await this.isRegistered(payload);
    if (isRegistered) throw new ForbiddenException('User already exist');

    const user = await this.userRepos.create({
      ...payload,
    });
    await this.sendRegistrationToken(user);
    this.logger.log('user registration successfull');
    return 'user registration successfully please check your email';
  }

  /**
   * @name validate
   * @param payload LoginDTO
   * @return User
   */
  async validate(payload: LoginDTO): Promise<User | Partner> {
    const user = await this.userRepos.findOne({
      where: {
        email: payload.email,
      },
    });

    const partner = await this.partnerModel.findOne({
      where: {
        email: payload.email,
      },
    });

    if (!user && !partner) throw new NotFoundException('User not found');
    const userToCheck = user || partner;
    const isPasswordCorrect = await userToCheck.isPasswordCorrect(
      payload.password,
    );

    if (!isPasswordCorrect) throw new ForbiddenException('Invalid credentials');
    const returnUser = userToCheck;
    delete returnUser.password;
    return returnUser;
  }

  /**
   * @name login
   * @param payload LoginDTO
   * @return User
   */
  async login(user: User, loginDto: LoginDTO): Promise<LoginOutput | string> {
    await this.createUserSession({
      userId: user.id,
      deviceName: loginDto.deviceName,
      city: loginDto.city,
      country: loginDto.country,
    });
    const { twoFactorAuth } = user;
    if (!user.isConfirmed) {
      await this.sendRegistrationToken(user);
      throw new BadRequestException(
        'user registration is not complete please check your email and verify',
      );
    }
    if (twoFactorAuth) return await this.send2FAToken(user);
    this.logger.log('user loggedIn successfull');
    return {
      email: user.email,
      id: user.id,
      token: await this.generateAccessToken({
        email: user.email,
        userId: user.id,
        login_route: 'general',
      }),
    };
  }

  async createUserSession(sessionDto: CreateSessionDto): Promise<void> {
    // does user have any session at all
    const sessionPayload: SessionTypeParams = {
      userId: sessionDto.userId,
      sessionId: uuidv4(),
      deviceInfo: sessionDto.deviceName,
      city: sessionDto.city,
      country: sessionDto.country,
    };
    const userSession = await this.userSession.findAll({
      where: {
        userId: sessionPayload.userId,
      },
    });

    if (!userSession.length) {
      await this.userSession.create({
        ...sessionPayload,
        lastLoggedIn: new Date(),
      });
    }
    let lastSession: UserSession;

    // find last session and update with same devices
    lastSession = await this.userSession.findOne({
      where: {
        sessionId: sessionPayload.sessionId,
        userId: sessionPayload.userId,
        deviceInfo: sessionPayload.deviceInfo,
      },
    });

    if (!lastSession) {
      lastSession = await this.userSession.create({
        ...sessionPayload,
        lastLoggedIn: new Date(),
      });
    }

    lastSession.city = sessionPayload.city;
    lastSession.country = sessionPayload.country;
    lastSession.lastLoggedIn = new Date();
    lastSession.save();
  }

  async authUser(user: any): Promise<User | Partner> {
    const authUser = await this.userRepos
      .scope('removeSensitivePayload')
      .findOne({
        where: {
          email: user.email,
        },
      });

    const partnerAuthUser = await this.partnerModel
      .scope('removeSensitivePayload')
      .findOne({
        where: {
          email: user.email,
        },
      });

    if (!authUser && !partnerAuthUser)
      throw new UnauthorizedException('Not found');

    return authUser || partnerAuthUser;
  }

  async resendRegistrationToken(email: string) {
    const user = await this.userService.findByEmailOrFailed(email);
    await this.sendRegistrationToken(user);
  }

  async verifyEmailLink(token: string): Promise<void> {
    const user = await this.jwtService.verify(token, {
      secret: this.config.get('jwt').registrationToken,
    });
    if (!user) throw new NotFoundException('Invalid verification link');
    const updateUser = await this.userService.findByEmail(user.email);
    updateUser.isConfirmed = true;
    updateUser.save();
    this.logger.log(
      `email link verification verified successfull for ${user.email}`,
    );
  }

  async googleLogin(
    googleUserPayload: GoogleSignDto,
  ): Promise<LoginOutput | string> {
    const { code } = googleUserPayload;
    const userData = await googleOathVerify(code);

    let user = await this.userService.findByEmail(userData.email);
    if (!user) {
      user = await this.createGoogleUser(userData);
      return await this.googleSessionLogin(user, googleUserPayload);
    }
    return await this.googleSessionLogin(user, googleUserPayload);
  }

  async googleSessionLogin(
    user: User,
    loginDto: GoogleSignDto,
  ): Promise<LoginOutput | string> {
    try {
      await this.createUserSession({
        userId: user.id,
        city: loginDto.city,
        country: loginDto.country,
        deviceName: loginDto.deviceName,
      });
      if (!user.isConfirmed) {
        await this.sendRegistrationToken(user);
        throw new BadRequestException(
          'user registration is not complete please check your email and verify',
        );
      }
      this.logger.log('user loggedIn successfull');
    } catch (error) {
      this.logger.error(error);
    }

    return {
      email: user.email,
      id: user.id,
      token: await this.generateAccessToken({
        email: user.email,
        userId: user.id,
        login_route: 'general',
      }),
    };
  }

  async sendRegistrationToken(user: User): Promise<void> {
    if (user.isConfirmed) {
      return;
    }
    const registrationToken = await this.generateRegisterationToken(
      user.email,
      user.userType,
    );
    const emailPayload: IEmailNotification = {
      type: 'VERIFICATION_EMAIL',
      to: user.email,
      verificationEmail: {
        context: {
          firstName: user.firstName,
          host: `${process.env.FRONT_END_URL}/verify-email/${registrationToken}`,
        },
      },
    };

    await this.notificationService.registrationVerification(emailPayload);
    this.logger.log('email notification sent successfull');
  }

  private async createGoogleUser(user: GoogleUserSignInPayload): Promise<User> {
    const newUser = await this.userRepos.create({
      email: user.email,
      firstName: user.given_name,
      lastName: user.family_name,
      isGoogleSign: true,
      isConfirmed: true,
    });
    return newUser;
  }

  async generateAccessToken(payload: any): Promise<string> {
    const jwtPayload = payload;
    return this.jwtService.sign(jwtPayload, {
      secret: this.config.get('jwt').jwtSecret,
    });
  }

  private async isRegistered(payload: RegistrationDTO): Promise<boolean> {
    const user = await this.userRepos.findOne({
      where: {
        email: payload.email.toLowerCase(),
      },
    });
    return !!user;
  }

  private async generateRegisterationToken(email: string, userType: string) {
    await this.userService.findByEmailOrFailed(email);
    const registrationToken = {
      email: email,
      userType: userType,
    };
    return this.jwtService.sign(registrationToken, {
      secret: this.config.get('jwt').registrationToken,
    });
  }

  async resetPassword(email: any): Promise<string> {
    const user = await this.userService.findByEmailOrFailed(email);
    const token = await this.generateRegisterationToken(
      user.email,
      user.userType,
    );
    const verificationLink = `${process.env.FRONT_END_URL}/reset-password?token=${token}`;
    const passwordResetPayload: IEmailNotification = {
      type: 'RESET_PASSWORD_EMAIL',
      to: user.email,
      resetPasswordEmail: {
        context: {
          verificationLink,
        },
      },
    };
    await this.notificationService.resetPasswordEmailNotification(
      passwordResetPayload,
    );
    this.logger.log('password reset email sent successfull');
    return 'password reset link has been sent to your email or phone number';
  }

  async send2FAToken(user: User): Promise<string> {
    if (user.twoFactorAuth && user.twoFactorAuth === 'email') {
      return this.dispatchTwoFaTokenEmail(user);
    }
  }

  private async dispatchTwoFaTokenEmail(user: User): Promise<string> {
    const twoFaToken = Math.random().toString().substring(2, 8);
    user.twoFaToken = twoFaToken;
    user.save();
    const emailPayload: IEmailNotification = {
      type: 'TWO_FA_AUTHENTICATION',
      to: user.email,
      twoFaEmail: {
        context: {
          twoFaToken,
        },
      },
    };

    await this.notificationService.sendTwoFaEmail(emailPayload);
    this.logger.log('email notification sent successfull');
    return 'authentication login code has been sent to your email or phone number';
  }

  private async verifyResetPasswordEmailLink(token: string): Promise<any> {
    const user = await this.jwtService.verify(token, {
      secret: this.config.get('jwt').registrationToken,
    });
    return user;
  }

  async verify2fa(token: string): Promise<LoginOutput | string> {
    const user = await this.userRepos.findOne({
      where: {
        twoFaToken: token,
      },
    });
    const partner = await this.userRepos.findOne({
      where: {
        twoFaToken: token,
      },
    });
    if (user) {
      user.twoFaToken = null;
      user.save();
      return {
        email: user.email,
        id: user.id,
        token: await this.generateAccessToken({
          email: user.email,
          userId: user.id,
          login_route: 'general',
        }),
      };
    }

    if (partner) {
      partner.twoFaToken = null;
      partner.save();
      return {
        email: partner.email,
        id: partner.id,
        token: await this.generateAccessToken({
          email: partner.email,
          userId: partner.id,
          login_route: 'partner',
        }),
      };
    }

    throw new NotFoundException('Invalid token');
  }

  async updatePassword(payload: UpdatePasswordDTO): Promise<string> {
    const verify = await this.verifyResetPasswordEmailLink(payload.token);
    if (payload.newPassword != payload.confirmNewPassword) {
      throw new BadRequestException('Confirmed password does not merge');
    }
    const hashManager = new HashManager();
    const password = await hashManager.bHash(payload.newPassword);
    await this.userRepos.update(
      {
        password,
      },
      {
        where: {
          email: verify.email,
        },
      },
    );

    return 'user password Updated';
  }

  async getUserSessions(userId: string): Promise<UserSession[]> {
    return await this.userSession.findAll({
      limit: 5,
      where: {
        userId: userId,
      },
    });
  }
}
