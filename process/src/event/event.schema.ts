import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { KafkaMessageKey } from '@kneonix-part/common';

export type EventDocument = Event & Document;

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true })
  agentId: string;

  @Prop({ required: true, enum: KafkaMessageKey })
  name: KafkaMessageKey;

  @Prop({ required: true })
  value: number;

  @Prop({ required: true })
  timestamp: number;

  // This will later store rule matches:
  @Prop({ type: [String], default: [] })
  matchedRules: string[];
}

export const EventSchema = SchemaFactory.createForClass(Event);
