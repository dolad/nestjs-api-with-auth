import { Module, forwardRef } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { PartnerController } from './controller';
import { PartnerServices } from './services';
import { AuthModule } from '../auth/auth.module';
import { FinancialInformationModule } from 'src/financial-information/financial-info.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    UserModule,
    FinancialInformationModule,
  ],
  controllers: [PartnerController],
  providers: [PartnerServices],
  exports: [PartnerServices],
})
export class PartnerModule {}
