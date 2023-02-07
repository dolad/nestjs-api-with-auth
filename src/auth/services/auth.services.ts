import {
    BadGatewayException,
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  User,
  UserAttributes,
  UserType,
} from 'src/storage/postgres/user.schema';
import { USER_REPOSITORY } from 'src/utils/constants';
import { RegistrationDTO } from '../dtos/registration.dto';
import { Op } from 'sequelize';
import { LoginDTO } from '../dtos/login.dto';
import { LoginOutput } from '../types/loginOut.type';
import { JwtService } from '@nestjs/jwt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IEmailNotification } from 'src/notification/interface/email-notification.interface';
import { ConfigService } from '@nestjs/config';
import { GoogleUserSignInPayload } from '../types/google.type';
import { UserServices } from 'src/user/services/user.services';
import { IAuthUser } from 'src/user/types/user.types';
import { GoogleSignDto } from '../dtos/google-signin-dto';
import { googleOathVerify } from '../dtos/google-oath-service';


@Injectable()
export class AuthService {
  private logger: Logger = new Logger(AuthService.name);
  constructor(
    @Inject(USER_REPOSITORY) private userRepos: typeof User,
    private readonly jwtService: JwtService,
    private eventEmitter: EventEmitter2,
    private readonly config: ConfigService,
    private readonly userService: UserServices,
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
  async validate(payload: LoginDTO): Promise<User> {
    const user = await this.userService.findByEmailOrFailed(payload.email);
    const isPasswordCorrect = await user.isPasswordCorrect(payload.password);
    if (!isPasswordCorrect) throw new ForbiddenException('Invalid credentials');
    return user;
  }

  /**
   * @name login
   * @param payload LoginDTO
   * @return User
   */
  async login(user: User): Promise<LoginOutput | string> {
    const { twoFactorAuth } = user;
    if(!user.isConfirmed){
        await this.sendRegistrationToken(user);
        return 'user registration not successfully please check your email';
    }
    if (twoFactorAuth) return await this.send2FAToken(user);
    this.logger.log('user loggedIn successfull');
    return {
      email: user.email,
      id: user.id,
      token: await this.generateAccessToken(user),
    };
  }

  async authUser(user: any): Promise<User> {
    return await this.userRepos
      .scope('removeSensitivePayload')
      .findByPk(user.userId);
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

  async googleLogin(googleUserPayload:GoogleSignDto): Promise<LoginOutput | string> {
    const {code } = googleUserPayload;
    const userData = await googleOathVerify(code);
    let user = await this.userService.findByEmail(userData.email);
    if (!user){
       user = await this.createGoogleUser(userData)
       return await this.login(user);
    }
    return await this.login(user);
  }

  private async sendRegistrationToken(user: User): Promise<void> {
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
          host: `http://${process.env.APP_URL}/api/v1/auth/verify/${registrationToken}`,
        },
      },
    };

    this.eventEmitter.emit('notification.email', emailPayload);
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

  private async generateAccessToken(user: any) {
    const jwtPayload = { email: user.email, userId: user.id };
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

  // async resetPassword(email: any): Promise<string>{
  //     await this.userService.findByEmailOrFailed(email);

  //     return
  // }

  private async send2FAToken(user: User): Promise<string> {
    if (user.twoFactorAuth && user.twoFactorAuth === 'email') {
      return this.dispatchTwoFaTokenEmail(user.email);
    }
    return;
  }

  private dispatchTwoFaTokenEmail(email: string): string {
    const twoFaToken = Math.random().toString().substring(2, 8);
    const emailPayload: IEmailNotification = {
      type: 'TWO_FA_AUTHENTICATION',
      to: email,
      twoFaEmail: {
        context: {
          twoFaToken,
        },
      },
    };

    this.eventEmitter.emit('two-fa-auth.email', emailPayload);

    this.logger.log('email notification sent successfull');
    return 'authentication login code has been sent to your email or phone number';
  }
}
