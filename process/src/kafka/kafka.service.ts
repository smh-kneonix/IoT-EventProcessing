import { Injectable } from '@nestjs/common';
import { KafkaMessageValue, KafkaMessageKey } from '@kneonix-part/common';

@Injectable()
export class KafkaService {
  async handleEvent(event: KafkaMessageValue) {
    if (event.name === KafkaMessageKey.TEMPERATURE) {
      console.log('Processing temperature event:', event);
    }

    if (event.name === KafkaMessageKey.VOLTAGE) {
      console.log('Processing voltage event:', event);
    }
  }
}
