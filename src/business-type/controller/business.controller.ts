import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { wrapResponseMessage, IResponseMessage } from "../../utils/response.map";
import { BusinessTypeServices } from "../services/business.services";

@Controller('business-type')
@ApiTags('Business')
export class BusinessTypeController {
    constructor(private readonly businessTypeService: BusinessTypeServices){}

    @Get('')
    async listBusinessType(): Promise<IResponseMessage>{
        const response = await this.businessTypeService.listBusinesType()
        return wrapResponseMessage("list of business fetch successfull", response);
    }
}