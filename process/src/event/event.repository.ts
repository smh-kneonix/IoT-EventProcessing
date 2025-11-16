import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Event, EventDocument } from './event.schema';
import { Model } from 'mongoose';
import type { KafkaMessageValue } from '@kneonix-part/common';

@Injectable()
export class EventRepository {
  constructor(
    @InjectModel(Event.name)
    private readonly eventModel: Model<EventDocument>,
  ) {}

  async saveEvent(event: KafkaMessageValue): Promise<EventDocument> {
    return this.eventModel.create({
      agentId: event.agentId,
      name: event.name,
      value: event.value,
      timestamp: event.timestamp,
      matchedRules: [],
    });
  }

  async findRecentByAgent(agentId: string) {
    return this.eventModel
      .find({ agentId })
      .sort({ timestamp: -1 })
      .limit(1)
      .lean();
  }

  async findEventsByType(type: string) {
    return this.eventModel.find({ name: type }).lean();
  }
}
