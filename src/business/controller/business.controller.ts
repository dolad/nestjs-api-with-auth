import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { wrapResponseMessage, IResponseMessage } from "src/utils/response.map";
import { BusinessServices } from "../services/business.services";

@Controller('business-type')
@ApiTags('Business')
export class BusinessTypeController {
    constructor(private readonly businessTypeService: BusinessServices){}

    @Get('')
    async listBusinessType(): Promise<IResponseMessage>{
        const response = await this.businessTypeService.listBusinesType()
        return wrapResponseMessage("list of business fetch successfull", response);
    }
}