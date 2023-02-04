import { Inject, Injectable } from "@nestjs/common";
import { BusinessServices } from "src/business/services/business.services";
import { User } from "../../storage/postgres/user.schema";
import { USER_REPOSITORY } from "../../utils/constants";
import { IAuthUser } from "../types/user.types";

@Injectable()
export class UserServices {
    constructor(
        @Inject(USER_REPOSITORY) private userRepos: typeof User
    ){
        
    }
    async findByEmail(email:string): Promise<User>{
        return await this.userRepos.findOne({
            where: {
                email: email.toLowerCase(),
            }
        })
    }

    async findByEmailOrFailed(email:string): Promise<User>{
        const user = await this.findByEmail(email);
        if(!user){
            throw new Error("User not found");
        }

        return user;
    }
    async enableTwoFaAuth(user: IAuthUser, twoFactorAuth: string): Promise<string>{
        await this.userRepos.update({
            twoFactorAuth,
        },{
            where: {
                email: user.email
            }
        })
        return "Two Factor Authentication Enabled Succesfully"
    }

}