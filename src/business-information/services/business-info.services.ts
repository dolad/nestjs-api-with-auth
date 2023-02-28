import { Inject } from "@nestjs/common";
import { BusinessInformation } from "../../storage/postgres/business-information.schema";
import { BUSINESS_INFORMATION_REPOSITORY } from "../../utils/constants";
import { CreateBusinessInformationDTO } from "../dto/business-info.dto";



export class BusinessInformationServices {
    constructor(
        @Inject(BUSINESS_INFORMATION_REPOSITORY) private businessInfoRepo: typeof BusinessInformation 
    ){}

     async create(payload: CreateBusinessInformationDTO): Promise<any>{
      return await this.businessInfoRepo.create(
          {
            ...payload,
          }
        )
    }

} 