import { Body, Controller, Post, UseGuards, Request, Param, Get, Req } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { LoginDTO } from "../dtos/login.dto";
import { RegistrationDTO } from "../dtos/registration.dto";
import { ResendRegistationDTO } from "../dtos/resendRegistration.dto";
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

   @ApiResponse({
      status: 200,
      description: 'Resend verification',
   })
   @ApiResponse({ status: 500, description: 'Internal Server Error' })
   @Post('resend-registration-token')
   async resendRegistration(@Body() resendRegistrationDto:ResendRegistationDTO): Promise<string> {
      await this.authServices.sendRegistrationToken(resendRegistrationDto.email);
      return "verification email send successfully"
   }

   @ApiResponse({
      status: 200,
      description: 'verify Email link',
   })
   @ApiResponse({ status: 500, description: 'Internal Server Error' })
   @Get('verify/:token')
   async verifyEmailLink(@Param('token') token:string): Promise<string> {
      await this.authServices.verifyEmailLink(token);
      return "link verification succesfull"
   }

   @ApiResponse({
      status: 200,
      description: 'verify Email link',
   })
   @Get('google/redirect')
   @UseGuards(AuthGuard('google'))
   async googleAuthRedirect(@Req() req): Promise<LoginOutput>{
      return this.authServices.googleLogin(req)
   }
}
