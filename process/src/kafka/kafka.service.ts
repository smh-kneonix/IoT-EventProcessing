import { Injectable } from '@nestjs/common';
import { KafkaMessageValue } from '@kneonix-part/common';
import { EventService } from '../event/event.service';
import { MatchingService } from '../matching/matching.service';

@Injectable()
export class KafkaService {
  constructor(
    private readonly eventService: EventService,
    private readonly matchingService: MatchingService,
  ) {}

  async handleEvent(event: KafkaMessageValue) {

    const savedEvent = await this.eventService.save(event);

    await this.matchingService.matchEvent(event);
    console.log(savedEvent)
    return savedEvent;
  }
}
