import { ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { AuthService } from "../../auth/services/auth.services";
import { UpdateBusinessInformationDTO } from "../../business-information/dto/business-info.dto";
import { BusinessInformationServices } from "../../business-information/services/business-info.services";
import { User, UserType } from "../../storage/postgres/user.schema";
import { USER_REPOSITORY } from "../../utils/constants";
import { AddUserToBusinessEntity } from "../dto/add-user.dto";
import { ChangePasswordPayload, UpdateCreatorDetails } from "../dto/update-user-password.dto";
import { IAuthUser} from "../types/user.types";
import { UserSession } from "src/storage/postgres/user-session.schema";


@Injectable()
export class UserServices {
    constructor(
        @Inject(USER_REPOSITORY) private userRepos: typeof User,
        private readonly businessInfoService: BusinessInformationServices,
        private readonly authServices: AuthService,
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
            throw new NotFoundException("User not found");
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

    async findById(id: string): Promise<User>{
       return await this.userRepos.scope('removeSensitivePayload').findByPk(id);
    }

    async getUserSession(user: IAuthUser): Promise<UserSession[]>{
       return await this.authServices.getUserSessions(user);
    }


    async changePassword(payload:ChangePasswordPayload, user:IAuthUser): Promise<string>{
       const verifyOldPassword = await this.userRepos.findByPk(user.userId);
       const isOldPasswordCorrect = await verifyOldPassword.isPasswordCorrect(payload.oldPassword);
       if(!isOldPasswordCorrect) throw new ForbiddenException('Old password is not correct');
       await verifyOldPassword.updatePassword( verifyOldPassword,payload.newPassword);
       return "Password Updated Successfull";
    }

    async updateCreatorDetails(payload:UpdateCreatorDetails, user:IAuthUser): Promise<string>{
       await this.userRepos.update({
       ...payload
      },{
        where: {
           id: user.userId 
        }
      }) 
      
      return "Creator Updated Successfully";
    }


    async addBusinessEntityUser(payload: AddUserToBusinessEntity, user:IAuthUser): Promise<string>{
        const creator = await this.userRepos.findOne({
            where: {
                id: user.userId,
                userType: UserType.BUSINESS
            }
        });

        if(!creator.businessEntityId){
            throw new ForbiddenException("user has not add a business")
        }
        const createNewUser = await this.userRepos.create({
            ...payload,
            businessEntityId: creator.businessEntityId,
            userType: UserType.VEIWER
        });

        await this.authServices.sendRegistrationToken(createNewUser)
        return "User Added Successfully"
    }

    async getEntityUser (user:IAuthUser): Promise<User[]>{
        
        const creator = await this.userRepos.findOne({
            where: {
                id: user.userId,
            }
        });

        const getAllUserEntities = await this.userRepos.findAll({
            where:{
                businessEntity: creator.businessEntityId
            }
        })

        return getAllUserEntities
    }

    
    async updateBusinessInfo(payload: UpdateBusinessInformationDTO, user:IAuthUser): Promise<string>{
        await this.businessInfoService.update(payload);
        return "Business entity Updated succesfully"
    }






    



}