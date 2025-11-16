import {
  IsEnum,
  IsNumber,
  IsString,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';

import { KafkaMessageKey } from '@kneonix-part/common';
import { ERuleOperator } from '../enums/rules.enum';

export class CreateRuleDto {
  
  @IsString()
  agentId?: string;

  @IsEnum(KafkaMessageKey)
  key: KafkaMessageKey;

  @IsEnum(ERuleOperator)
  operator: ERuleOperator;

  @IsNumber()
  value: number;

  @IsNumber()
  @Min(1)
  @Max(86400000) //24 hour
  timeRange: number;

  @IsBoolean()
  isActive?: boolean;
}
