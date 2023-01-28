import { BadRequestException, ForbiddenException, Inject, Injectable, Logger, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { User, UserAttributes, UserType } from "src/storage/postgres/user.schema";
import { USER_REPOSITORY } from "src/utils/constants";
import { RegistrationDTO } from "../dtos/registration.dto";
import { Op } from "sequelize";
import { LoginDTO } from "../dtos/login.dto";
import { LoginOutput } from "../types/loginOut.type";
import { JwtService } from '@nestjs/jwt';
import { EventEmitter2 } from "@nestjs/event-emitter";
import { IEmailNotification } from "src/notification/interface/email-notification.interface";
import { ConfigService } from "@nestjs/config";
import { GoogleUserSignInPayload } from "../types/google.type";
import { UserServices } from "src/user/services/user.services";

@Injectable()
export class AuthService {
    private logger: Logger = new Logger(AuthService.name)
    constructor(
        @Inject(USER_REPOSITORY) private userRepos: typeof User,
        private readonly jwtService: JwtService,
        private eventEmitter: EventEmitter2,
        private readonly config: ConfigService,
        private readonly userService: UserServices
    ) { }
    async register(payload: RegistrationDTO): Promise<string> {
        const isRegistered = await this.isRegistered(payload);
        if (isRegistered) throw new ForbiddenException("User already exist");

        const user = await this.userRepos.create({
            ...payload
        })
        await this.sendRegistrationToken(user.email);
        this.logger.log("user registration successfull");
        return "user registration successfully please check your email"
    }

    /**
    * @name validate
    * @param payload LoginDTO
    * @return User
    */
    async validate(payload: LoginDTO): Promise<User> {
        const user = await this.userService.findByEmailOrFailed(payload.email)
        const isPasswordCorrect = await user.isPasswordCorrect(payload.password);
        if (!isPasswordCorrect) throw new ForbiddenException("Invalid credentials");
        return user
    }

    /**
     * @name login
     * @param payload LoginDTO
     * @return User
     */
    async login(user: any): Promise<LoginOutput> {
        const { isConfirmed } = await this.userRepos.scope('removeSensitivePayload').findByPk(user.id);
        if (!isConfirmed) {
            await this.sendRegistrationToken(user.email);
            throw new UnauthorizedException("user not confirm please check your mail and verify")
        }
        return {
            email: user.email,
            id: user.id,
            token: await this.generateAccessToken(user)
        }
    }
    private async generateAccessToken(user: any){

       const jwtPayload = { email: user.email, userId: user.id};
        return this.jwtService.sign(jwtPayload, {
            secret:this.config.get('jwt').jwtSecret
        })
    }

    private async isRegistered(payload: RegistrationDTO): Promise<boolean> {
        const user = await this.userRepos.findOne({
            where: {
                email: payload.email.toLowerCase(),
            }
        })
        return !!user
    }

    private async generateRegisterationToken(email: string, userType: string) {
        await this.userService.findByEmailOrFailed(email)
        const registrationToken = {
            email: email,
            userType: userType
        }
        return this.jwtService.sign(registrationToken, {
            secret: this.config.get('jwt').registrationToken
        })
    }

    async sendRegistrationToken(email: string): Promise<void> {
        const user = await this.userService.findByEmail(email);
        const registrationToken = await this.generateRegisterationToken(user.email, user.userType);
        const emailPayload: IEmailNotification = {
            type: "VERIFICATION_EMAIL",
            to: user.email,
            verificationEmail: {
                context: {
                    firstName: user.firstName,
                    host: `http://${process.env.APP_URL}/api/v1/auth/verify/${registrationToken}`
                }
            }
        }

        this.eventEmitter.emit(
            'notification.email',
            emailPayload
        )

        this.logger.log("email notification sent successfull");

    }

    async verifyEmailLink(token: string): Promise<void> {       
        const user = await this.jwtService.verify(token, {
            secret: this.config.get('jwt').registrationToken
        }) 
        if(!user) throw new NotFoundException("Invalid verification link");
        const updateUser = await this.userService.findByEmail(user.email);
        updateUser.isConfirmed = true;
        updateUser.save(); 
        this.logger.log(`email link verification verified successfull for ${user.email}`);
    }

    async googleLogin(googleUser: GoogleUserSignInPayload): Promise<LoginOutput>{
        let userExist: User;
        if(!googleUser){
            throw new UnauthorizedException("No user is returned from google account");
        }
        userExist = await this.userService.findByEmail(googleUser.email);
        if(!userExist){
           userExist = await this.createGoogleUser(googleUser)
        }
        return {
            email: userExist.email,
            id: userExist.id,
            token: await this.generateAccessToken(googleUser)
        }
    }

    private async createGoogleUser(user: GoogleUserSignInPayload): Promise<User>{
        const newUser = await this.userRepos.create({
            email: user.email,
            firstName: user.firstName,
            lastName: user.firstName,
           isGoogleSign: true
        })
        return newUser;
    }




}