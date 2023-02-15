import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { Kyc } from "../../storage/postgres/kyc.schema";
import { User } from "../../storage/postgres/user.schema";
import { KYC_REPOSITORY, USER_REPOSITORY } from "../../utils/constants";
import { AddBusinessInformationDTO, CreateKyCDto } from "../dto/create-kyc.dto";
import { IAuthUser } from "../types/user.types";


@Injectable()
export class KycServices {
    constructor(
        @Inject(KYC_REPOSITORY) private kycRepos: typeof Kyc,
        @Inject(USER_REPOSITORY) private userRepos: typeof User,
    ){
        
    }

    async createKycUser(payload:CreateKyCDto, user: IAuthUser): Promise<Kyc>{
        const kyc = await this.kycRepos.create({
            ...payload,
            userId: user.userId,
            kycStep: 1,
        })

        return kyc;
    }

    async addBusinessName(payload: AddBusinessInformationDTO, user: IAuthUser): Promise<string>{
        const authUser = await this.userRepos.scope('removeSensitivePayload').findOne({
            where: {email:user.email},
            include: [Kyc]
            
        });

        const currentKycStep = authUser.kyc.kycStep
        if(currentKycStep < 1){
            throw new BadRequestException("this user has not done kyc step 1")
        }

        if(currentKycStep > 1){
            throw new BadRequestException("this user has completed this kyc step")
        }

        const updateKyc = this.kycRepos.update({
            ...payload,
            kycStep: currentKycStep + 1
        },{
            where:{
                id: authUser.kyc.id
            }
        })
       
        return "Business Information added succesfully"
    }

}