import { Controller, Post, UseGuards, Request, Body, Get, Session as GetSession } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SessionGuard } from 'src/auth/guards/session.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { IResponseMessage, wrapResponseMessage } from '../../utils/response.map';
import { EnabledTwoFaAuthPayload } from '../dto/enable-2fa.dto';
import { UserServices } from '../services/user.services';
import { UserSession } from '../types/user.types';


@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserServices) {}

  
  @UseGuards(SessionGuard)
  @Post('session/check')
  @UseGuards(JwtAuthGuard)
  async createBusinessInformation(@Request() req, @GetSession() session: UserSession ): Promise<any> {
    const response = await this.userService.getUserSession(req.user); 
    return wrapResponseMessage("business information added", response);
  }

  @UseGuards(SessionGuard)
  @Post('session/destroy')
  @UseGuards(JwtAuthGuard)
  async destroySession(@Request() req, @GetSession() session: UserSession ): Promise<IResponseMessage> {
    const response = new Promise((resolve, reject) => {
      session.destroy((err) => {
      if (err) reject(err);
      resolve(undefined);
      })
    });
    return wrapResponseMessage("business information added", response);
  }

  @Post('enable-two-fa')
  @UseGuards(JwtAuthGuard)
  async enableTwoFa(@Request() req, @Body() payload:EnabledTwoFaAuthPayload): Promise<IResponseMessage> {
    const response = await this.userService.enableTwoFaAuth(req.user, payload.type);
    return wrapResponseMessage("twoFactorAuthentication enabled", response);
  }

  
}
