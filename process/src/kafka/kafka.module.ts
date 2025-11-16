import { Module, OnModuleInit } from '@nestjs/common';
import { Kafka, Consumer, Admin } from 'kafkajs';
import { KafkaService } from './kafka.service';
import { KafkaMessageValue } from '@kneonix-part/common';
import { EventModule } from '../event/event.module';

@Module({
  providers: [KafkaService],
  imports: [EventModule],
})
export class KafkaModule implements OnModuleInit {
  private consumer: Consumer;

  constructor(private readonly handler: KafkaService) {}

  async onModuleInit() {
    const kafka = new Kafka({
      clientId: 'process-service',
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

    // Init Consumer
    this.consumer = kafka.consumer({
      groupId: 'process-group',
    });

    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: process.env.KAFKA_TOPIC!,
      fromBeginning: false,
    });

    console.log('Process service is consuming events...');

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        const json = message.value?.toString();
        if (!json) return;

        const event = JSON.parse(json) as KafkaMessageValue;

        await this.handler.handleEvent(event);
      },
    });
  }
}
