import { Module } from '@nestjs/common';
import { KafkaModule } from './kafka/kafka.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot(), KafkaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
