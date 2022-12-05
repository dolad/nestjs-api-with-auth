import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { UserModule } from "src/user/user.module";
import { User } from "../storage/postgres/user.schema";
import { AuthController } from "./controller/auth.controller";
import { AuthServices } from "./services/auth.services";

@Module({
    imports: [
        SequelizeModule.forFeature([User]),
        UserModule
    ],
    controllers: [AuthController],
    providers: [AuthServices],
    exports: [AuthServices]
})

export class AuthModule {}