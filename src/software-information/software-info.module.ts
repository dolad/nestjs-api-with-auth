import { Module } from "@nestjs/common";
import { SoftwareInfoController } from "./controller/software-info.controller";
import { softwareInfoProviders} from "./providers/provider";
import { SoftwareInformationServices } from "./services/software-info.services";
import { RutterServices } from "./services/rutter.service";
import { BusinessEntityModule } from "src/business-entity/business.module";

@Module({
    imports: [BusinessEntityModule],
    controllers: [SoftwareInfoController],
    providers: [SoftwareInformationServices, RutterServices, ...softwareInfoProviders],
    exports: [SoftwareInformationServices],
})

export class SoftwareInformationModule {}