import { Module } from "@nestjs/common";
import { BusinessEntityController } from "./controller/business-entity.controller";
import { businessTypeProviders } from "./providers/provider";
import { BusinessEntityServices } from "./services/business-entity.services";

@Module({
    imports: [],
    controllers: [BusinessEntityController],
    providers: [BusinessEntityServices, businessTypeProviders],
    exports: [BusinessEntityServices],
})

export class BusinessEntityModule {}