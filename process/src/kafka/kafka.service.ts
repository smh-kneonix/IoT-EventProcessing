import { Injectable } from '@nestjs/common';
import { KafkaMessageValue, KafkaMessageKey } from '@kneonix-part/common';

@Injectable()
export class KafkaService {
  async handleEvent(event: KafkaMessageValue) {
    console.log('Received event:', event);
    if (event.name === KafkaMessageKey.TEMPERATURE) {
    }

    if (event.name === KafkaMessageKey.VOLTAGE) {
    }
  }
}
