import { Inject } from "@nestjs/common";
import { BusinessType } from "src/storage/postgres/busines-type.schema";
import { BUSINESS_TYPE_REPOSITORY } from "src/utils/constants";



export class BusinessServices {
    constructor(
        @Inject(BUSINESS_TYPE_REPOSITORY) private businessTypeRepo: typeof BusinessType 
    ){}

    async listBusinesType(): Promise<BusinessType[]>{
        return await this.businessTypeRepo.findAll();
    }

} 