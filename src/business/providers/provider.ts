import { BusinessType } from "src/storage/postgres/busines-type.schema";
import { BUSINESS_TYPE_REPOSITORY } from "src/utils/constants";

export const businessTypeProviders = 
    {
        provide: BUSINESS_TYPE_REPOSITORY,
        useValue: BusinessType  
    }
