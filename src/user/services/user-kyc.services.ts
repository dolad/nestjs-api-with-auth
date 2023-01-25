import { Inject, Injectable } from "@nestjs/common";
import { Kyc } from "src/storage/postgres/kyc.schema";
import { KYC_REPOSITORY } from "../../utils/constants";
import { CreateKyCDto } from "../dto/create-kyc.dto";
import { IAuthUser } from "../types/user.types";


@Injectable()
export class KycServices {
    constructor(
        @Inject(KYC_REPOSITORY) private kycRepos: typeof Kyc,
    ){
        
    }

    async createKycUser(payload:CreateKyCDto, user: IAuthUser): Promise<any>{
        return await this.kycRepos.create({
            ...payload,
            userId: user.userId,
            kycStep: 1,
        })
        
    }

}