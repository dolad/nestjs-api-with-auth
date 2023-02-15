import { BusinessType } from "../../storage/postgres/busines-type.schema";
import { BUSINESS_TYPE_REPOSITORY } from "../../utils/constants";

export const businessTypeProviders = 
    {
        provide: BUSINESS_TYPE_REPOSITORY,
        useValue: BusinessType  
    }
