import { Module } from "@nestjs/common";
import { BusinessTypeController } from "./controller/business.controller";
import { businessTypeProviders } from "./providers/provider";
import { BusinessServices } from "./services/business.services";

@Module({
    imports: [],
    controllers: [BusinessTypeController],
    providers: [BusinessServices, businessTypeProviders],
    exports: [BusinessServices],
})

export class BusinessModule {}