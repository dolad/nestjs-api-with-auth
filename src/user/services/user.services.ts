import { Inject, Injectable } from "@nestjs/common";
import { User } from "../../storage/postgres/user.schema";
import { USER_REPOSITORY } from "../../utils/constants";

@Injectable()
export class UserServices {
    constructor(
        @Inject(USER_REPOSITORY) private userRepos: typeof User,
    ){
        
    }

}