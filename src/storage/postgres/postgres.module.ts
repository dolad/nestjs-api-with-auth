import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { IAppConfig} from "../../config/interface";
import { User } from "../postgres/user.schema";

import dbConfig = require('../../config/postgres')
import { Kyc } from "../postgres/kyc.schema";
import { BusinessType } from "../postgres/busines-type.schema";
import { BusinessEntity } from "../postgres/business-entity.schema";
import { BusinessInformation } from "../postgres/business-information.schema";
import { BankProviderCountries } from "../postgres/bank-provider-countries";
import { BankProvider } from "../postgres/bank-provider";
import { FinancialConnectDetails } from "../postgres/financial-account";
import { SoftwareConnectDetails } from "../postgres/software-info.schema";
import { UserSession } from "./user-session.schema";

console.log(process.env.NODE_ENV)

@Module({
    imports: [
          SequelizeModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => ({
              ...dbConfig[config.get<IAppConfig>('app').environment],
              models:[User, Kyc, BusinessEntity, BusinessInformation, BusinessType, BankProviderCountries, BankProvider, FinancialConnectDetails, SoftwareConnectDetails, UserSession],
              autoLoadModels: true,
               sync: {
                force: false,
                alter: false,
              },
              pool: {
                max: 15,
                min: 0,
                idle: 10000,
                acquire: 10000
              }
            }),
          }),
        
    ]
})

export class PostgresModule {}