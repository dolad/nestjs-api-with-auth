import { Module } from "@nestjs/common";
import { BusinessTypeModule } from "../business-type/business.module";
import { UserController } from "./controllers/user.controllers";
import { UserServices } from "./services/user.services";
import {  userProviders } from "./user.provider";

@Module({
    imports: [BusinessTypeModule],
    providers: [userProviders, UserServices],
    exports: [userProviders, UserServices],
    controllers: [UserController]
})

export class UserModule {}
