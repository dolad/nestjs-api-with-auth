import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { IAppConfig, IRedis } from "../config/interface";
import { User } from "./postgres/user.schema";

import dbConfig = require('../config/postgres')
import { Kyc } from "./postgres/kyc.schema";
import { BusinessType } from "./postgres/busines-type.schema";
import { BusinessEntity } from "./postgres/business-entity.schema";
import { BusinessInformation } from "./postgres/business-information.schema";

console.log(process.env.NODE_ENV)

@Module({
    imports: [
          SequelizeModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => ({
              ...dbConfig[config.get<IAppConfig>('app').environment],
              models:[User, Kyc, BusinessEntity, BusinessInformation, BusinessType],
              autoLoadModels: true,
               sync: {
                force: false,
                alter: false,
              },
            }),
          }),
          
          BullModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => ({
              redis: {
                ...config.get<IRedis>('redis'),
              },
            }),
          }),
    ]
})

export class StorageModule {}
