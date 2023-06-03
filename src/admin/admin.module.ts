import { FinanceModule } from '@faker-js/faker';
import { Module } from '@nestjs/common';
import { FinancialInformationModule } from 'src/financial-information/financial-info.module';
import { AdminUserModules } from './user/admin-user.module';

@Module({
  imports: [AdminUserModules, FinancialInformationModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AdminModules {}
