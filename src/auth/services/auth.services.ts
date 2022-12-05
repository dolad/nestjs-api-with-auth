import { ForbiddenException, Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { User } from "src/storage/postgres/user.schema";
import { USER_REPOSITORY } from "src/utils/constants";
import { RegistrationDTO } from "../dtos/registration.dto";
import { Op } from "sequelize";
import { LoginDTO } from "../dtos/login.dto";
import { LoginOutput } from "../types/loginOut.type";

@Injectable()
export class AuthServices {
    private logger: Logger = new Logger(AuthServices.name)
    constructor(
        @Inject(USER_REPOSITORY) private userRepos: typeof User,
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
     * 
     * @param payload LoginDTO
     * @return User
     */
    async login(payload: LoginDTO): Promise<LoginOutput> {
        const user = await this.userRepos.findOne({
            where: {email: payload.email.toLowerCase()}
        })

        if(!user) throw new NotFoundException("user does not exist")
        const isPasswordCorrect = await user.isPasswordCorrect(payload.password);
        if(!isPasswordCorrect) throw new ForbiddenException("Invalid credentials");
        // remove this and later add this to the token
        return {
            email: user.email,
            username: user.username,
            token: "some-token"
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