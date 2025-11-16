import { Module, Global } from '@nestjs/common';
import { createClient } from 'redis';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      useFactory: async () => {
        const redis = createClient({
          url: process.env.REDIS_URI,
        });

        redis.on('error', (err) => console.error('Redis error:', err));

        await redis.connect();
        console.log('Redis connected');

        return redis;
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
