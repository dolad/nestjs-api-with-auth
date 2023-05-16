import { Body, Controller, Post, UseGuards, Request, Param, Get, Req, HttpCode, HttpStatus, } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { IResponseMessage, wrapResponseMessage } from "../../utils/response.map";
import { GoogleSignDto } from "../dtos/google-signin-dto";
import { LoginDTO } from "../dtos/login.dto";
import { RegistrationDTO } from "../dtos/registration.dto";
import { ResendRegistationDTO,  UpdatePasswordDTO, Verify2FaToken } from "../dtos/resendRegistration.dto";
import { AdminRouteGuard } from "../guards/admin.guard";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { LocalAuthGuard } from "../guards/local-auth.guard";
import { AuthService } from "../services/auth.services";

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
   @HttpCode(HttpStatus.OK)
   @UseGuards(LocalAuthGuard)
   @Post('login')
   async login(@Request() req, @Body() loginDto: LoginDTO): Promise<IResponseMessage>{
      const response = await this.authServices.login(req.user,loginDto);
      return wrapResponseMessage("User login successful", response);
   }

   @ApiResponse({
      status: 200,
      description: 'Admin login',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard, AdminRouteGuard)
  @Post('admin/login')
   async adminLogin(@Request() req, @Body() loginDto: LoginDTO): Promise<IResponseMessage>{
      const response = await this.authServices.login(req.user,loginDto);
      return wrapResponseMessage("Admin loggedIn successful", response);
   }

   @ApiResponse({
      status: 200,
      description: 'Resend verification',
   }) 
   @ApiResponse({ status: 500, description: 'Internal Server Error' })
   @Post('resend-registration-token')
   async resendRegistration(@Body() resendRegistrationDto:ResendRegistationDTO): Promise<IResponseMessage> {
      const response = await this.authServices.resendRegistrationToken(resendRegistrationDto.email);
      return wrapResponseMessage("verification email send successfully", response);
      
   }

   @ApiResponse({
      status: 200,
      description: 'verify Email link',
   })
   @ApiResponse({ status: 500, description: 'Internal Server Error' })
   @Get('verify/:token')
   async verifyRegistrationEmailLink(@Param('token') token:string): Promise<IResponseMessage> {
      await this.authServices.verifyEmailLink(token);
      return wrapResponseMessage("link verification succesfull", null);
   }

   @ApiResponse({
      status: 200,
      description: 'social authentication',
   })
   @Post('google/login')
   async googleAuthRedirect(@Body() googleSignToken: GoogleSignDto): Promise<IResponseMessage>{
      const response = await this.authServices.googleLogin(googleSignToken)
      return wrapResponseMessage("google redirection succesfull", response);

   }

  
  @Get('auth-user')
  @UseGuards(JwtAuthGuard)
  async createBusinessOwnerInformation(@Request() req): Promise<IResponseMessage> {
    const response = await this.authServices.authUser(req.user);
    return wrapResponseMessage("auth user fetched succesfull", response);
  }

   @ApiResponse({
      status: 200,
      description: 'Password Reset',
   })
   @ApiResponse({ status: 500, description: 'Internal Server Error' })
   @Post('reset-password/send-email')
   async resetPassword(@Body() resetPasswordDto:ResendRegistationDTO): Promise<IResponseMessage> {
      await this.authServices.resetPassword(resetPasswordDto.email);
      return wrapResponseMessage("verification email send successfully", "verification email send successfully")
   }

   @ApiResponse({
      status: 200,
      description: 'Password Reset',
   })
   @ApiResponse({ status: 500, description: 'Internal Server Error' })
   @Post('verify-2fa')
   async verify2fa(@Body() verify2FaTokenPayload:Verify2FaToken): Promise<IResponseMessage> {
      const response = await this.authServices.verify2fa(verify2FaTokenPayload.token);
      return wrapResponseMessage("verification email send successfully", response)
   }

 
   @ApiResponse({
      status: 200,
      description: 'Password Update Password',
   })
   @ApiResponse({ status: 500, description: 'Internal Server Error' })
   @Post('reset-password/update')
   async resetPasswordUpdate(@Body() updatePasswordDto:UpdatePasswordDTO): Promise<IResponseMessage> {
      await this.authServices.updatePassword(updatePasswordDto);
      return wrapResponseMessage(" password updated successful", "OK")
   }

}
