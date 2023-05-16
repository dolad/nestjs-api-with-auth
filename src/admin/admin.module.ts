import { Module } from "@nestjs/common";
import { AdminUserModules } from "./user/admin-user.module";

@Module({
    imports: [AdminUserModules],
    controllers: [],
    providers: [],
    exports: [],
})

export class AdminModules {}