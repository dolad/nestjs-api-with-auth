import { User } from "../storage/postgres/user.schema";
import { USER_REPOSITORY } from "../utils/constants";

export const userProviders = 
    {
        provide: USER_REPOSITORY,
        useValue: User
    }
