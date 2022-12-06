import { Body, Controller, Post, UseGuards, Request } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { LoginDTO } from "../dtos/login.dto";
import { RegistrationDTO } from "../dtos/registration.dto";
import { LocalAuthGuard } from "../guards/local-auth.guard";
import { AuthService } from "../services/auth.services";
import { LoginOutput } from "../types/loginOut.type";

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
   constructor(private readonly authServices: AuthService){}

   @ApiResponse({
      status: 200,
      description: 'User Registration',
   })
   @ApiResponse({ status: 500, description: 'Internal Server Error' })
   @Post('register')
   async register(@Body() registrationDTO: RegistrationDTO): Promise<any>{
      return await this.authServices.register(registrationDTO);
   }

   @ApiResponse({
         status: 200,
         description: 'User login',
   })
   @ApiResponse({ status: 500, description: 'Internal Server Error' })
   @UseGuards(LocalAuthGuard)
   @Post('login')
   async login(@Request() req): Promise<LoginOutput>{
      return await this.authServices.login(req.user);
   }

}
