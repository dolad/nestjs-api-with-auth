import { Module } from "@nestjs/common";
import { BusinessInfoController } from "./controller/business-info.controller";
import { businessInformationProviders } from "./providers/provider";
import { BusinessInformationServices } from "./services/business-info.services";

@Module({
    imports: [],
    controllers: [BusinessInfoController],
    providers: [BusinessInformationServices, businessInformationProviders],
    exports: [BusinessInformationServices, businessInformationProviders],
})

export class BusinessInformationModule {}