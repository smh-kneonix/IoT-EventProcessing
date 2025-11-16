import { Module } from '@nestjs/common';
import { KafkaModule } from './kafka/kafka.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisModule } from './redis/redis.module';
import { EventModule } from './event/event.module';
import { RuleModule } from './rule/rule.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL!, {
      dbName: 'process-service',
    }),

    RedisModule,
    KafkaModule,
    EventModule,
    RuleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
