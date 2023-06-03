import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { AdminRouteGuard } from 'src/auth/guards/admin.guard';
import { FinancialInformationModule } from 'src/financial-information/financial-info.module';
import { UserModule } from '../../user/user.module';
import { AdminUserController } from './admin-user.controller';
import { AdminService } from './admin-user.services';

@Module({
  imports: [UserModule, AuthModule, FinancialInformationModule],
  controllers: [AdminUserController],
  providers: [AdminRouteGuard, AdminService],
  exports: [],
})
export class AdminUserModules {}
