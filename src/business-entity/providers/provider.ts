import { BusinessOwners } from "src/storage/postgres/business-owners.dto";
import { BusinessEntity } from "../../storage/postgres/business-entity.schema";
import { BUSINESS_ENTITY_REPOSITORY, BUSINESS_OWNER } from "../../utils/constants";

export const businessEntityProviders = 
    {
        provide: BUSINESS_ENTITY_REPOSITORY,
        useValue: BusinessEntity  
    }

export const businessOwnersProviders = 
    {
        provide: BUSINESS_OWNER,
        useValue: BusinessOwners  
    }
