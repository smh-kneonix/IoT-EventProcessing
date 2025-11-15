import { Inject, Injectable } from '@nestjs/common';
import type { Producer } from 'kafkajs';
import { KafkaMessage, KafkaMessageValue } from '@kneonix-part/common';

@Injectable()
export class AppService {
  constructor(
    @Inject('KAFKA_PRODUCER')
    private readonly producer: Producer,
  ) {}

  async sendEvent(event: Omit<KafkaMessageValue, 'agentId' | 'timestamp'>) {
    const message: KafkaMessage = {
      key: event.name,
      value: {
        agentId: process.env.AGENT_ID!,
        name: event.name,
        value: event.value,
        timestamp: Date.now(),
      },
    };

    await this.producer.send({
      topic: process.env.KAFKA_TOPIC!,
      messages: [
        {
          key: message.key,
          value: JSON.stringify(message.value),
        },
      ],
    });

    console.log('Sent Event:', message);
  }
}
