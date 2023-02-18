import { Inject } from "@nestjs/common";
import { BusinessType } from "../../storage/postgres/busines-type.schema";
import { BUSINESS_ENTITY_REPOSITORY } from "../../utils/constants";



export class BusinessEntityServices {
    constructor(
        @Inject(BUSINESS_ENTITY_REPOSITORY) private businessTypeRepo: typeof BusinessType 
    ){}

    async listBusinesType(): Promise<BusinessType[]>{
        return await this.businessTypeRepo.findAll();
    }

} 