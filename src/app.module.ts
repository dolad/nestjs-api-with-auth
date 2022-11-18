import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { SequelizeModule } from '@nestjs/sequelize';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bull';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig from './config/app.config';
import dbConfig from './config/db.config';
import { IAppConfig, IRedis } from './config/interface';
import { AllExceptionsFilter } from './exceptions/exception.handler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, dbConfig],
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        ...dbConfig().postgres[config.get<IAppConfig>('app').environment],
        dialect: 'postgres',
      }),
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      ttl: 1,
      limit: 30,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        redis: {
          ...config.get<IRedis>('redis'),
        },
      }),
    }),
  ],

  controllers: [AppController],

  providers: [
    AppService,

    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule {}
