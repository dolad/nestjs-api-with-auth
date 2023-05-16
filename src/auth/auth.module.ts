import { Module, forwardRef } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { SequelizeModule } from "@nestjs/sequelize";
import { UserModule } from "../user/user.module";
import { User } from "../storage/postgres/user.schema";
import { AuthController } from "./controller/auth.controller";
import { AuthService } from "./services/auth.services";
import { JWTStrategy } from "./strategy/jwt.strategy";
import { LocalStrategy } from "./strategy/local.strategy";
// import { SessionSerializer } from "./serializer/session.serializer";
import { userSessionProvider } from "./providers/user-session.provider";
import { NotificationModule } from "src/notification/notification.module";
import { AdminRouteGuard } from "./guards/admin.guard";
import { ClientRouteGuard } from "./guards/business.guard";

@Module({
    imports: [
        SequelizeModule.forFeature([User]),
        forwardRef(() => UserModule),
        PassportModule,
        NotificationModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions:{
                expiresIn: '24h'
            }
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JWTStrategy, LocalStrategy, AdminRouteGuard, ClientRouteGuard,
         userSessionProvider],
    exports: [AuthService]
})

export class AuthModule {}