import { Module } from "@nestjs/common";
import { BusinessTypeController } from "./controller/business.controller";
import { businessTypeProviders } from "./providers/provider";
import { BusinessTypeServices } from "./services/business.services";

@Module({
    imports: [],
    controllers: [BusinessTypeController],
    providers: [BusinessTypeServices, businessTypeProviders],
    exports: [BusinessTypeServices],
})

export class BusinessTypeModule {}