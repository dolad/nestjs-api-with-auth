import { Module } from "@nestjs/common";
import { BusinessEntityModule } from "src/business-entity/business.module";
import { FinancialInfoController } from "./controller/financial-info.controller";
import { financialInfoProviders} from "./providers/provider";
import { FinancialInformationServices } from "./services/financial-info.services";
import { SaltEdge } from "./services/saltedge.service";

@Module({
    imports: [BusinessEntityModule],
    controllers: [FinancialInfoController],
    providers: [FinancialInformationServices, SaltEdge, ...financialInfoProviders],
    exports: [FinancialInformationServices],
})

export class FinancialInformationModule {}