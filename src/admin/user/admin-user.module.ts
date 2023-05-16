import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { AdminRouteGuard } from "src/auth/guards/admin.guard";
import { UserModule } from "../../user/user.module";
import { AdminUserController } from "./admin-user.controller";

@Module({
    imports: [UserModule, AuthModule],
    controllers: [AdminUserController],
    providers: [AdminRouteGuard],
    exports: [],
})

export class AdminUserModules {}