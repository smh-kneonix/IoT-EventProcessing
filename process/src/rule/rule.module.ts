import { Module } from '@nestjs/common';
import { RuleService } from './rule.service';
import { RuleController } from './rule.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Rule, RuleSchema } from './rule.schema';
import { RuleRepository } from './rule.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Rule.name, schema: RuleSchema }]),
  ],
  controllers: [RuleController],
  providers: [RuleService, RuleRepository],
  exports: [RuleService],
})
export class RuleModule {}
