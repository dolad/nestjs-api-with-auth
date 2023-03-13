import { Kyc } from "../storage/postgres/kyc.schema";
import { User } from "../storage/postgres/user.schema";
import { KYC_REPOSITORY, USER_REPOSITORY, BUSINESS_TYPE_REPOSITORY } from "../utils/constants";

export const userProviders = 
    {
        provide: USER_REPOSITORY,
        useValue: User
    }



