import { Module, forwardRef } from "@nestjs/common";
import { BusinessInformationModule } from "src/business-information/business.module";
import { AuthModule } from "../auth/auth.module";
import { BusinessTypeModule } from "../business-type/business.module";
import { UserController } from "./controllers/user.controllers";
import { UserServices } from "./services/user.services";
import {  userProviders } from "./user.provider";

@Module({
    imports: [
        BusinessTypeModule,
        forwardRef(() => AuthModule),
        BusinessInformationModule
    ],
    providers: [userProviders, UserServices],
    exports: [userProviders, UserServices],
    controllers: [UserController]
})

export class UserModule {}
