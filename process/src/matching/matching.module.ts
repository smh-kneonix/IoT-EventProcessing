import { Module } from '@nestjs/common';
import { MatchingService } from './matching.service';
import { RuleModule } from '../rule/rule.module';
import { EventModule } from '../event/event.module';

@Module({
  providers: [MatchingService],
  imports: [RuleModule, EventModule],
  exports: [MatchingService],
})
export class MatchingModule {}
