import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { SequelizeModule } from "@nestjs/sequelize";
import { UserModule } from "src/user/user.module";
import { User } from "../storage/postgres/user.schema";
import { AuthController } from "./controller/auth.controller";
import { AuthService } from "./services/auth.services";
import { JWTStrategy } from "./strategy/jwt.strategy";
import { LocalStrategy } from "./strategy/local.strategy";
import { jwtConst } from "./utils/auth.constant";

@Module({
    imports: [
        SequelizeModule.forFeature([User]),
        UserModule,
        PassportModule,
        JwtModule.register({
            secret:jwtConst.secret,
            signOptions:{
                expiresIn: '24h'
            }
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JWTStrategy, LocalStrategy],
    exports: [AuthService]
})

export class AuthModule {}