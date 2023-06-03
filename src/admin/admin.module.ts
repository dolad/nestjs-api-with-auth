import { Module } from '@nestjs/common';
import { AdminUserModules } from './user/admin-user.module';
import { AdminService } from './user/admin-user.services';

@Module({
  imports: [AdminUserModules],
  controllers: [],
  providers: [AdminService],
  exports: [],
})
export class AdminModules {}
