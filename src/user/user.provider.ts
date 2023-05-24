import { Partner } from "../storage/postgres/partner.schema";
import { User } from "../storage/postgres/user.schema";

import {  USER_REPOSITORY, PATNER_REPOSITORY  } from "../utils/constants";

export const userProviders = [
    {
        provide: USER_REPOSITORY,
        useValue: User
    },
    {
        provide: PATNER_REPOSITORY,
        useValue: Partner
    }
];




