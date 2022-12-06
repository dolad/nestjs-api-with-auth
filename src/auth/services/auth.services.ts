import { ForbiddenException, Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { User, UserAttributes } from "src/storage/postgres/user.schema";
import { USER_REPOSITORY } from "src/utils/constants";
import { RegistrationDTO } from "../dtos/registration.dto";
import { Op } from "sequelize";
import { LoginDTO } from "../dtos/login.dto";
import { LoginOutput } from "../types/loginOut.type";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    private logger: Logger = new Logger(AuthService.name)
    constructor(
        @Inject(USER_REPOSITORY) private userRepos: typeof User,
        private readonly jwtService: JwtService,
    ){}
    async register(payload: RegistrationDTO): Promise<string> {
        const isRegistered = await this.isRegistered(payload)
        if(isRegistered) throw new ForbiddenException("User already exist");
        await this.userRepos.create({
            ...payload
        })
        this.logger.log("user registration successfull");
        return "user registration successfully"
    }

     /**
     * @name validate
     * @param payload LoginDTO
     * @return User
     */
      async validate(payload: LoginDTO): Promise<User> {
        const user = await this.userRepos.findOne({
            where: {email: payload.email.toLowerCase()}
        })

        if(!user) throw new NotFoundException("user does not exist")
        const isPasswordCorrect = await user.isPasswordCorrect(payload.password);
        if(!isPasswordCorrect) throw new ForbiddenException("Invalid credentials");
        return user
    }

    /**
     * @name login
     * @param payload LoginDTO
     * @return User
     */
    async login(user: any): Promise<LoginOutput> {
        const jwtPayload = {email: user.email, username:user.username};
        return {
            email: user.email,
            username: user.username,
            token: this.jwtService.sign(jwtPayload)
        }
    }

    private async isRegistered(payload: RegistrationDTO): Promise<boolean> {        
            const user = await this.userRepos.findOne({
                where: {
                    [Op.or]: [
                        {
                            email:payload.email.toLowerCase(),
                        },
                        {
                            username: payload.username.toLowerCase()
                        }
                    ]
                }
            })
            return !!user
    }


  

}