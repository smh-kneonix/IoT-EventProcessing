import { Inject, Injectable } from '@nestjs/common';
import type { Producer } from 'kafkajs';
import {
  KafkaMessage,
  KafkaMessageKey,
  KafkaMessageValue,
} from '@kneonix-part/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { faker } from '@faker-js/faker';

@Injectable()
export class KafkaService {
  constructor(
    @Inject('KAFKA_PRODUCER')
    private readonly producer: Producer,
  ) {}

  private generateRandomEvent(): KafkaMessageValue {
    const possibleKeys = Object.values(KafkaMessageKey);
    const key = faker.helpers.arrayElement(possibleKeys);

    return {
      agentId: process.env.AGENT_ID!,
      name: key,
      value: faker.number.float({ min: 0, max: 100 }),
      timestamp: Date.now(),
    };
  }

  private async sendEvent(event: KafkaMessageValue) {
    const message: KafkaMessage = {
      key: event.name,
      value: event,
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
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleCron() {
    const event = this.generateRandomEvent();
    await this.sendEvent(event);
  }
}
