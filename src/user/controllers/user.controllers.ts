import { Controller, Post, UseGuards, Request, Body, Get, Session as GetSession } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
// import { SessionGuard } from '../../auth/guards/session.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { IResponseMessage, wrapResponseMessage } from '../../utils/response.map';
import { AddUserToBusinessEntity } from '../dto/add-user.dto';
import { EnabledTwoFaAuthPayload } from '../dto/enable-2fa.dto';
import { ChangePasswordPayload, UpdateCreatorDetails } from '../dto/update-user-password.dto';
import { UserServices } from '../services/user.services';
import { UserSession } from '../types/user.types';



@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserServices) {}

  
  @Post('enable-two-fa')
  @UseGuards(JwtAuthGuard)
  async enableTwoFa(@Request() req, @Body() payload:EnabledTwoFaAuthPayload): Promise<IResponseMessage> {
    const response = await this.userService.enableTwoFaAuth(req.user, payload.type);
    return wrapResponseMessage("twoFactorAuthentication enabled", response);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  async changeUserPassword(@Request() req, @Body() payload: ChangePasswordPayload): Promise<IResponseMessage> {
    const response = await this.userService.changePassword(payload, req.user);
    return wrapResponseMessage("Password Changed Successfully", response);
  }

  @Post('update-creator-details')
  @UseGuards(JwtAuthGuard)
  async updateCreatorDetails(@Request() req, @Body() payload: UpdateCreatorDetails): Promise<IResponseMessage> {
    const response = await this.userService.updateCreatorDetails(payload, req.user);
    return wrapResponseMessage("Update Creator Details", response);
  }

  @Post('business-entity-user')
  @UseGuards(JwtAuthGuard)
  async addBusinessEntityUser(@Request() req, @Body() payload:AddUserToBusinessEntity): Promise<IResponseMessage> {
    const response = await this.userService.addBusinessEntityUser(payload, req.user);
    return wrapResponseMessage("Update Creator Details", response);
  }


  @Get('business-entity-user')
  @UseGuards(JwtAuthGuard)
  async updateBusinessEntityInformation(@Request() req): Promise<IResponseMessage> {
    const response = await this.userService.getEntityUser(req.user);
    return wrapResponseMessage("Update Creator Details", response);
  }

  
  @Get('sessions')
  @UseGuards(JwtAuthGuard)
  async getUserSession(@Request() req): Promise<IResponseMessage> {
    const response = await this.userService.getUserSession(req.user);
    return wrapResponseMessage("Update Creator Details", response);
  }

  





  
}
