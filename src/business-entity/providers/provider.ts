import { BusinessType } from "../../storage/postgres/busines-type.schema";
import { BUSINESS_ENTITY_REPOSITORY } from "../../utils/constants";

export const businessTypeProviders = 
    {
        provide: BUSINESS_ENTITY_REPOSITORY,
        useValue: BusinessType  
    }
