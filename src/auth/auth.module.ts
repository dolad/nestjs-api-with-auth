import { Module } from "@nestjs/common";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { SequelizeModule } from "@nestjs/sequelize";
import { UserModule } from "src/user/user.module";
import { User } from "../storage/postgres/user.schema";
import { AuthController } from "./controller/auth.controller";
import { AuthService } from "./services/auth.services";
import { GoogleStrategy } from "./strategy/google.strategy";
import { JWTStrategy } from "./strategy/jwt.strategy";
import { LocalStrategy } from "./strategy/local.strategy";

@Module({
    imports: [
        SequelizeModule.forFeature([User]),
        UserModule,
        PassportModule,
        JwtModule.register({
            secret:process.env.JWT_SECRET,
            signOptions:{
                expiresIn: '24h'
            }
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JWTStrategy, LocalStrategy, GoogleStrategy],
    exports: [AuthService]
})

export class AuthModule {}