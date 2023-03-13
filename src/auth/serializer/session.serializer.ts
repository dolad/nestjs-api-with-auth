import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { User } from "src/storage/postgres/user.schema";
import { UserServices } from "src/user/services/user.services";

@Injectable()
export class SessionSerializer extends PassportSerializer{
    constructor(private readonly userService: UserServices){
        super()
    }

    serializeUser(user: User, done: (err: Error, user: string) => void) {
      done(null, user.id)   
    }

    async deserializeUser(payload: any, done: (err: Error, payload: User) => void ): Promise<any> {
        const user = await this.userService.findById(payload.id);
        done(null, user)
    }
}