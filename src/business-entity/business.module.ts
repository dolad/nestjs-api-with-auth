import { Module, forwardRef } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "../storage/postgres/user.schema";
import { BusinessEntity } from "../storage/postgres/business-entity.schema";
import { BusinessEntityController } from "./controller/business-entity.controller";
import { businessEntityProviders } from "./providers/provider";
import { BusinessEntityServices } from "./services/business-entity.services";
import { UserModule } from "../user/user.module";
import { BusinessInformationModule } from "../business-information/business-info.module";
import { BusinessInformation } from "../storage/postgres/business-information.schema";

@Module({
    imports: [
        SequelizeModule.forFeature([BusinessEntity, User, BusinessInformation]),
        forwardRef(() => UserModule),
        BusinessInformationModule,
    ],
    controllers: [BusinessEntityController],
    providers: [BusinessEntityServices, businessEntityProviders],
    exports: [BusinessEntityServices, businessEntityProviders]
})

export class BusinessEntityModule {} 