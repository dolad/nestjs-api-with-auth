import { Module } from '@nestjs/common';
import { BusinessEntityModule } from 'src/business-entity/business.module';
import { UserModule } from 'src/user/user.module';
import { FinancialInfoController } from './controller/financial-info.controller';
import { financialInfoProviders } from './providers/provider';
import { FinancialInformationServices } from './services/financial-info.services';
import { SaltEdge } from './services/saltedge.service';

@Module({
  imports: [BusinessEntityModule, UserModule],
  controllers: [FinancialInfoController],
  providers: [
    FinancialInformationServices,
    SaltEdge,
    ...financialInfoProviders,
  ],
  exports: [FinancialInformationServices, ...financialInfoProviders],
})
export class FinancialInformationModule {}
