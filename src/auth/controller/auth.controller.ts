import { Body, Controller, Post, UseGuards, Request, Param, Get, Req } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { IResponseMessage, wrapResponseMessage } from "src/utils/response.map";
import { LoginDTO } from "../dtos/login.dto";
import { RegistrationDTO } from "../dtos/registration.dto";
import { ResendRegistationDTO } from "../dtos/resendRegistration.dto";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
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
   async register(@Body() registrationDTO: RegistrationDTO): Promise<IResponseMessage>{
      const response = await this.authServices.register(registrationDTO);
      return wrapResponseMessage("User registration successful", response);
   }

   @ApiResponse({
         status: 200,
         description: 'User login',
   })
   @ApiResponse({ status: 500, description: 'Internal Server Error' })
   @UseGuards(LocalAuthGuard)
   @Post('login')
   async login(@Request() req, @Body() loginDto: LoginDTO): Promise<IResponseMessage>{
      const response = await this.authServices.login(req.user);
      return wrapResponseMessage("User login successful", response);
   }

   @ApiResponse({
      status: 200,
      description: 'Resend verification',
   }) 
   @ApiResponse({ status: 500, description: 'Internal Server Error' })
   @Post('resend-registration-token')
   async resendRegistration(@Body() resendRegistrationDto:ResendRegistationDTO): Promise<IResponseMessage> {
      const response = await this.authServices.sendRegistrationToken(resendRegistrationDto.email);
      return wrapResponseMessage("verification email send successfully", response);
      
   }

   @ApiResponse({
      status: 200,
      description: 'verify Email link',
   })
   @ApiResponse({ status: 500, description: 'Internal Server Error' })
   @Get('verify/:token')
   async verifyEmailLink(@Param('token') token:string): Promise<IResponseMessage> {
      await this.authServices.verifyEmailLink(token);
      return wrapResponseMessage("link verification succesfull", null);
   }

   @ApiResponse({
      status: 200,
      description: 'social authentication',
   })
   @Get('google/redirect')
   @UseGuards(AuthGuard('google'))
   async googleAuthRedirect(@Req() req): Promise<IResponseMessage>{
      const response = await this.authServices.googleLogin(req)
      return wrapResponseMessage("google redirection succesfull", response);

   }

  @Get('auth-user')
  @UseGuards(JwtAuthGuard)
  async createBusinessOwnerInformation(@Request() req): Promise<IResponseMessage> {
    const response = await this.authServices.authUser(req.user);
    return wrapResponseMessage("auth user fetched succesfull", response);
  }

   // @ApiResponse({
   //    status: 200,
   //    description: 'Password Reset',
   // })
   // @ApiResponse({ status: 500, description: 'Internal Server Error' })
   // @Post('reset-password')
   // async resetPassword(@Body() resetPasswordDto:ResendRegistationDTO): Promise<string> {
   //    await this.authServices.sendRegistrationToken(resetPasswordDto.email);
   //    return "verification email send successfully"
   // }

}
