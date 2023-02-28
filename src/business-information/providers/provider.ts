import { BusinessInformation } from "../../storage/postgres/business-information.schema";
import { BUSINESS_INFORMATION_REPOSITORY } from "../../utils/constants";

export const businessInformationProviders = 
    {
        provide: BUSINESS_INFORMATION_REPOSITORY,
        useValue: BusinessInformation  
    }
