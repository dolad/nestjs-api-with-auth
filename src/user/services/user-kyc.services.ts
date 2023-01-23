import { Inject, Injectable } from "@nestjs/common";
import { Kyc } from "src/storage/postgres/kyc.schema";
import { KYC_REPOSITORY } from "../../utils/constants";
import { CreateKyCDto } from "../dto/create-kyc.dto";

@Injectable()
export class KycServices {
    constructor(
        @Inject(KYC_REPOSITORY) private kycRepos: typeof Kyc,
    ){
        
    }

    async createKycUser(payload:CreateKyCDto): Promise<Kyc>{

       
        const newKyc = await this.kycRepos.create({
            ...payload,
            userId: "sdgagdsgafd",
            kycStep: 1,
        })
        return newKyc
    }

}