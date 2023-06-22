import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { PartnerController } from './controller';
import { PartnerServices } from './services';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [UserModule, AuthModule],
  controllers: [PartnerController],
  providers: [PartnerServices],
  exports: [PartnerServices],
})
export class PartnerModule {}
