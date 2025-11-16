import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { KafkaMessageKey } from '@kneonix-part/common';

export type EventDocument = Event & Document;

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true, type: String })
  agentId: string;

  @Prop({ required: true, enum: KafkaMessageKey, type: String })
  name: KafkaMessageKey;

  @Prop({ required: true, type: Number })
  value: number;

  @Prop({ required: true, type: Number })
  timestamp: number;

  @Prop({ type: [String], default: [] })
  matchedRules: string[];
}

export const EventSchema = SchemaFactory.createForClass(Event);
