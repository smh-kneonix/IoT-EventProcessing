import { Module, Global } from '@nestjs/common';
import { Kafka, Producer, Admin } from 'kafkajs';
import { KafkaService } from './kafka.service';

@Global()
@Module({
  providers: [
    KafkaService,
    {
      provide: 'KAFKA_PRODUCER',
      useFactory: async () => {
        const kafka = new Kafka({
          clientId: `agent-${process.env.AGENT_ID}`,
          brokers: [process.env.KAFKA_BROKER_URI!],
        });

        const admin: Admin = kafka.admin();
        await admin.connect();
        const topics = await admin.listTopics();

        if (!topics.includes(process.env.KAFKA_TOPIC!)) {
          await admin.createTopics({
            topics: [
              {
                topic: process.env.KAFKA_TOPIC!,
                numPartitions: 3,
                replicationFactor: 1,
              },
            ],
          });
          console.log(`Created Topic: ${process.env.KAFKA_TOPIC}`);
        }

        await admin.disconnect();

        const producer: Producer = kafka.producer();
        await producer.connect();

        console.log(
          `Agent ${process.env.AGENT_ID} connected to Kafka producer`,
        );

        return producer;
      },
    },
  ],
  exports: ['KAFKA_PRODUCER'],
})
export class KafkaModule {}
