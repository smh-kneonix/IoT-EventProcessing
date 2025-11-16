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
    return await this.eventModel.create({
      agentId: event.agentId,
      name: event.name,
      value: event.value,
      timestamp: event.timestamp,
      matchedRules: [],
    });
  }

  async findRecentByAgent(agentId: string) {
    return await this.eventModel
      .find({ agentId })
      .sort({ timestamp: -1 })
      .limit(1)
      .lean();
  }

  async findEventsByType(type: string) {
    return await this.eventModel.find({ name: type }).lean();
  }
  async addMatchedRules(timestamp: number, ruleIds: string[]) {
    return await this.eventModel.updateOne(
      { timestamp },
      { $addToSet: { matchedRules: { $each: ruleIds } } },
    );
  }

  async findByAgent(agentId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.eventModel
        .find({ agentId })
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.eventModel.countDocuments({ agentId }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByRule(ruleId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.eventModel
        .find({ matchedRules: ruleId })
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.eventModel.countDocuments({ matchedRules: ruleId }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
