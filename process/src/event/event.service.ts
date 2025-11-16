import type { KafkaMessageValue } from '@kneonix-part/common';
import { Injectable } from '@nestjs/common';
import { EventRepository } from './event.repository';

@Injectable()
export class EventService {
  constructor(private readonly eventRepository: EventRepository) {}

  async save(event: KafkaMessageValue) {
    return await this.eventRepository.saveEvent(event);
  }

  async getLatestEvent(agentId: string) {
    return await this.eventRepository.findRecentByAgent(agentId);
  }

  async getEventsByType(type: string) {
    return await this.eventRepository.findEventsByType(type);
  }

  async addMatchedRules(timestamp: number, ruleIds: string[]) {
    return await this.eventRepository.addMatchedRules(timestamp, ruleIds);
  }

  async getEventsByRule(ruleId: string, page: number, limit: number) {
    return this.eventRepository.findByRule(ruleId, page, limit);
  }

  async getEventsByAgent(agentId: string, page: number, limit: number) {
    return this.eventRepository.findByAgent(agentId, page, limit);
  }
}
