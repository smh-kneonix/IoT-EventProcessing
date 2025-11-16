import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { KafkaMessageKey } from '@kneonix-part/common';
import { ERuleOperator } from './enums/rules.enum';

export type RuleDocument = Rule & Document;

@Schema({ timestamps: true })
export class Rule {
  @Prop({ type: String, default: '' })
  agentId?: string; // if its "", rule applies to all agents

  @Prop({
    type: String,
    required: true,
    enum: Object.values(KafkaMessageKey),
  })
  key: KafkaMessageKey;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(ERuleOperator),
  })
  operator: ERuleOperator;

  @Prop({ type: Number, required: true })
  value: number;

  @Prop({ type: Number, required: true })
  timeRange: number;

  @Prop({ type: Boolean, required: true })
  isActive: boolean;
}

export const RuleSchema = SchemaFactory.createForClass(Rule);
