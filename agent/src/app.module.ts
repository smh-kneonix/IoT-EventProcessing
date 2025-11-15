import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_PRODUCER',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: `agent-${process.env.AGENT_ID}`,
            brokers: [process.env.KAFKA_BROKER_URI!],
          },
          consumer: {
            groupId: 'AGENT_CONSUMER_GROUP',
          },
        },
      },
    ]),
    KafkaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
