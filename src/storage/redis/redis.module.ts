import { Module } from '@nestjs/common';
import IoRedis from 'ioredis';
import appConfig from 'src/config/app.config';

import { REDIS } from './redis.contants';

const redisClient = new IoRedis(appConfig().redis.url);

@Module({
  providers: [
    {
      provide: REDIS,
      useValue: redisClient
    },
  ],
  exports: [REDIS],
})
export class RedisModule {}
