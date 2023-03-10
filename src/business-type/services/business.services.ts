import { Inject } from "@nestjs/common";
import { BusinessType } from "../../storage/postgres/busines-type.schema";
import { BUSINESS_TYPE_REPOSITORY } from "../../utils/constants";



export class BusinessTypeServices {
    constructor(
        @Inject(BUSINESS_TYPE_REPOSITORY) private businessTypeRepo: typeof BusinessType 
    ){}

    async listBusinesType(): Promise<BusinessType[]>{
        return await this.businessTypeRepo.findAll();
    }

} 