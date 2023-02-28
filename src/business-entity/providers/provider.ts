import { BusinessEntity } from "../../storage/postgres/business-entity.schema";
import { BUSINESS_ENTITY_REPOSITORY } from "../../utils/constants";

export const businessEntityProviders = 
    {
        provide: BUSINESS_ENTITY_REPOSITORY,
        useValue: BusinessEntity  
    }
