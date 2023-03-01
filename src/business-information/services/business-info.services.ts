import { Inject } from "@nestjs/common";
import { BusinessInformation } from "../../storage/postgres/business-information.schema";
import { BUSINESS_INFORMATION_REPOSITORY } from "../../utils/constants";
import { ICreateBusinessInformationDTO } from "../dto/business-info.dto";



export class BusinessInformationServices {
    constructor(
        @Inject(BUSINESS_INFORMATION_REPOSITORY) private businessInfoRepo: typeof BusinessInformation 
    ){}

     async create(payload: ICreateBusinessInformationDTO, transaction: any): Promise<any>{
      return await this.businessInfoRepo.create(
          {
            ...payload,
          },
          {transaction}
        )
    }

} 