import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';

import { KafkaMessageKey } from '@kneonix-part/common';
import { ERuleOperator } from '../enums/rules.enum';

export class UpdateRuleDto {
  @IsOptional()
  @IsString()
  agentId?: string;

  @IsOptional()
  @IsEnum(KafkaMessageKey)
  key?: KafkaMessageKey;

  @IsOptional()
  @IsEnum(ERuleOperator)
  operator?: ERuleOperator;

  @IsOptional()
  @IsNumber()
  value?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(86400000)
  timeRange?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
