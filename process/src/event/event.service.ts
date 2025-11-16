import { Injectable } from '@nestjs/common';
import type { KafkaMessageValue } from '@kneonix-part/common';
import { EventRepository } from './event.repository';

@Injectable()
export class EventService {
  constructor(private readonly eventRepository: EventRepository) {}

  async save(event: KafkaMessageValue) {
    return this.eventRepository.saveEvent(event);
  }

  async getLatestEvent(agentId: string) {
    return this.eventRepository.findRecentByAgent(agentId);
  }

  async getEventsByType(type: string) {
    return this.eventRepository.findEventsByType(type);
  }
}
