import { CacheModule, Inject, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
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
// import IoRedis from 'ioredis'
// import { REDIS, RedisModule } from './storage/redis';
// import session from 'express-session';
// import RedisStore from 'connect-redis';



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
    // RedisModule,
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


export class AppModule{}


// export class AppModule implements NestModule {
//   constructor(@Inject(REDIS) private readonly redis: IoRedis){}
//   configure(consumer: MiddlewareConsumer){
//     const redisStore = new RedisStore({
//       client: this.redis,
//     })

//     consumer.apply(
//       session({
//         store: redisStore,
//         secret: appConfig().session.secret,
//         resave: false,
//         saveUninitialized: false,
//         cookie: {
//           httpOnly: true,
//           sameSite:true,
//           maxAge: 1000 * 60 * 15
//         }
//       })
//     ).forRoutes('*');
//   }
// }
