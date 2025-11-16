import { Injectable } from '@nestjs/common';
import { EventService } from '../event/event.service';
import type { KafkaMessageValue } from '@kneonix-part/common';
import { RuleService } from '../rule/rule.service';
import { RuleDocument } from '../rule/rule.schema';
import { ERuleOperator } from '../rule/enums/rules.enum';

@Injectable()
export class MatchingService {
  constructor(
    private readonly ruleService: RuleService,
    private readonly eventService: EventService,
  ) {}

  async matchEvent(event: KafkaMessageValue) {
    const rules = await this.ruleService.getActiveRulesFromCache();

    const relatedRules = rules.filter((rule) => rule.key === event.name);

    const matchedRuleIds: string[] = [];

    for (const rule of relatedRules) {
      if (this.isRuleMatched(rule, event)) {
        const id = rule._id as string;
        matchedRuleIds.push(id.toString());
      }
    }

    if (matchedRuleIds.length === 0) return;
    
    await this.eventService.addMatchedRules(event.timestamp, matchedRuleIds);
  }

  private isRuleMatched(rule: RuleDocument, event: KafkaMessageValue): boolean {
    const eventValue = event.value;
    const ruleValue = rule.value;

    switch (rule.operator) {
      case ERuleOperator.GREATER_THAN:
        return eventValue > ruleValue;

      case ERuleOperator.LESS_THAN:
        return eventValue < ruleValue;

      case ERuleOperator.GREATER_THAN_OR_EQUAL:
        return eventValue >= ruleValue;

      case ERuleOperator.LESS_THAN_OR_EQUAL:
        return eventValue <= ruleValue;

      case ERuleOperator.EQUAL:
        return eventValue === ruleValue;

      case ERuleOperator.NOT_EQUAL:
        return eventValue !== ruleValue;

      default:
        return false;
    }
  }
}
