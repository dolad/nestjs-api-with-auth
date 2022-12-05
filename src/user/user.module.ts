import { Module } from "@nestjs/common";
import { userProviders } from "./user.provider";

@Module({
    imports: [],
    providers: [userProviders],
    exports: [userProviders]
})

export class UserModule {}