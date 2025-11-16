import { Injectable } from '@nestjs/common';
import { KafkaMessageValue, KafkaMessageKey } from '@kneonix-part/common';
import { EventService } from '../event/event.service';

@Injectable()
export class KafkaService {
  constructor(private readonly eventService: EventService) {}

  async handleEvent(event: KafkaMessageValue) {
    const saved = await this.eventService.save(event);
    console.log(saved)

    if (event.name === KafkaMessageKey.TEMPERATURE) {
      // TODO: run rule matching here later
    }

    if (event.name === KafkaMessageKey.VOLTAGE) {
    }

    return saved;
  }
}
