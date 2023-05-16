import { Module, forwardRef } from "@nestjs/common";
import { ClientRouteGuard } from "../auth/guards/business.guard";
import { BusinessEntityModule } from "src/business-entity/business.module";
import { BusinessInformationModule } from "src/business-information/business-info.module";
import { AuthModule } from "../auth/auth.module";
import { BusinessTypeModule } from "../business-type/business.module";
import { UserController } from "./controllers/user.controllers";
import { UserServices } from "./services/user.services";
import {  userProviders } from "./user.provider";
import { NotificationModule } from "src/notification/notification.module";

@Module({
    imports: [
        BusinessTypeModule,
        forwardRef(() => AuthModule),
        BusinessInformationModule,
        forwardRef(() => BusinessEntityModule),
        NotificationModule
    ],
    providers: [userProviders, UserServices, ClientRouteGuard],
    exports: [userProviders, UserServices],
    controllers: [UserController]
})

export class UserModule {}
