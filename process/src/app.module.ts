import { Module } from '@nestjs/common';
import { KafkaModule } from './kafka/kafka.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisModule } from './redis/redis.module';
import { EventSchema } from './event/event.schema';
import { EventModule } from './event/event.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL!, {
      dbName: 'process-service',
    }),
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),

    RedisModule,
    KafkaModule,
    EventModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
