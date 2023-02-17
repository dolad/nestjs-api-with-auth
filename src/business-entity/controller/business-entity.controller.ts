import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { wrapResponseMessage, IResponseMessage } from "../../utils/response.map";
import { BusinessEntityServices } from "../services/business-entity.services";

@Controller('business-type')
@ApiTags('Business')
export class BusinessEntityController {
    constructor(private readonly businessTypeService: BusinessEntityServices){}

    @Get('')
    async listBusinessType(): Promise<IResponseMessage>{
        const response = await this.businessTypeService.listBusinesType()
        return wrapResponseMessage("list of business fetch successfull", response);
    }
}