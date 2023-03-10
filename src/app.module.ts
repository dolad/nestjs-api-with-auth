import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { SequelizeModule } from '@nestjs/sequelize';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig from './config/app.config';
import { AllExceptionsFilter } from './exceptions/exception.handler';
import { AuthModule } from './auth/auth.module';
import { StorageModule } from './storage/storage.module';
import { UserModule } from './user/user.module';
import { NotificationModule } from './notification/notification.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import emailConfiig from './config/email.confiig';
import { BusinessTypeModule } from './business-type/business.module';
import { BusinessEntityModule } from './business-entity/business.module';
import { BusinessInformationModule } from './business-information/business.module';
import { FinancialInformationModule } from './financial-information/financial-info.module';
import { SoftwareInformationModule } from './software-information/software-info.module';

// @ts-ignore

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig,emailConfiig],
    }),

    EventEmitterModule.forRoot({
      newListener: true,
      removeListener: true,
      verboseMemoryLeak: true,
    }),
    
    CacheModule.register({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      ttl: 1,
      limit: 30,
    }),
    
    StorageModule,
    UserModule,
    BusinessTypeModule,
    NotificationModule,
    BusinessEntityModule,
    AuthModule,
    BusinessInformationModule,
    FinancialInformationModule,
    SoftwareInformationModule

  ],

  controllers: [AppController],

  providers: [
    AppService,

    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule {}
