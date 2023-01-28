import { Module } from "@nestjs/common";
import { UserController } from "./controllers/user.controllers";
import { KycServices } from "./services/user-kyc.services";
import { UserServices } from "./services/user.services";
import { kycProviders, userProviders } from "./user.provider";

@Module({
    imports: [],
    providers: [userProviders, kycProviders, KycServices, UserServices],
    exports: [userProviders, UserServices],
    controllers: [UserController]
})

export class UserModule {}