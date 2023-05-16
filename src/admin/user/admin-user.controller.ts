import { Controller, Post, UseGuards, Request, Body, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AdminRouteGuard } from "../../auth/guards/admin.guard";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { IResponseMessage, wrapResponseMessage } from "../../utils/response.map";
import { UserServices } from "../../user/services/user.services";
import { ChangePasswordPayload, UpdateCreatorDetails } from "../../user/dto/update-user-password.dto";
import { EnabledTwoFaAuthPayload } from "../../user/dto/enable-2fa.dto";
import { AddUserToBusinessEntity } from "src/user/dto/add-user.dto";


@Controller('admin-user')
@ApiTags('AdminUser')
@UseGuards(JwtAuthGuard, AdminRouteGuard)
export class AdminUserController {
  constructor(private readonly userService: UserServices){}
  
  @Post('change-password')
  async changeUserPassword(@Request() req, @Body() payload: ChangePasswordPayload): Promise<IResponseMessage> {
    const response = await this.userService.changePassword(payload, req.user);
    return wrapResponseMessage("Password Changed Successfully", response);
  }

  @Post('enable-two-fa')
  async enableTwoFa(@Request() req, @Body() payload:EnabledTwoFaAuthPayload): Promise<IResponseMessage> {
    const response = await this.userService.enableTwoFaAuth(req.user, payload.type);
    return wrapResponseMessage("twoFactorAuthentication enabled", response);
  }

  @Get('sessions')
  async getUserSession(@Request() req): Promise<IResponseMessage> {
    const response = await this.userService.getUserSession(req.user);
    return wrapResponseMessage("Admin Session Fetched", response);
  }

  @Post('update')
  async updateDetails(@Request() req, @Body() payload: UpdateCreatorDetails): Promise<IResponseMessage> {
    const response = await this.userService.updateCreatorDetails(payload, req.user);
    return wrapResponseMessage(" Admin details updated", response);
  }


  @Post('add-admins')
  async addAdminUser(@Request() req, @Body() payload:AddUserToBusinessEntity): Promise<IResponseMessage> {
    const response = await this.userService.addAdminUser(payload);
    return wrapResponseMessage("Admin user Created", response);
  }

  @Get('get-admins')
  async getAdminUser(@Request() req): Promise<IResponseMessage> {
    const response = await this.userService.getAdminUsers();
    return wrapResponseMessage("Admin user successfully fetched", response);
  }


}