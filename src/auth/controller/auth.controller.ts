import { Body, Controller, Post } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { RegistrationDTO } from "../dtos/registration.dto";
import { AuthServices } from "../services/auth.services";

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
 constructor(private readonly authServices: AuthServices){}

 @ApiResponse({
    status: 200,
    description: 'Confirmation Email Successfully',
  })
 @ApiResponse({ status: 500, description: 'Internal Server Error' })
 @Post('register')
 async register(@Body() registrationDTO: RegistrationDTO): Promise<any>{
    return await this.authServices.register(registrationDTO);
 }
}