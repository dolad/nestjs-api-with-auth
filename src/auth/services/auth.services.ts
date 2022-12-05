import { ForbiddenException, Inject, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "src/storage/postgres/user.schema";
import { USER_REPOSITORY } from "src/utils/constants";
import { RegistrationDTO } from "../dtos/registration.dto";
import { Op } from "sequelize";

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