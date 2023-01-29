import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { BusinessType } from "src/storage/postgres/busines-type.schema";
import { BusinessServices } from "../services/business.services";

@Controller('business-type')
@ApiTags('Business')
export class BusinessTypeController {
    constructor(private readonly businessTypeService: BusinessServices){}

    @Get('')
    async listBusinessType(): Promise<BusinessType[]>{
        return this.businessTypeService.listBusinesType()
    }
}