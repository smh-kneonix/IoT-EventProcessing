import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { RuleRepository } from './rule.repository';
import { RuleDocument } from './rule.schema';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class RuleService {
  private readonly CACHE_KEY = 'rules:active';
  constructor(
    private readonly ruleRepository: RuleRepository,
    private readonly redisService: RedisService,
  ) {}

  async createRule(dto: CreateRuleDto): Promise<RuleDocument> {
    const rule = await this.ruleRepository.createRule(dto);
    await this.refreshCache();
    return rule;
  }

  async updateRule(id: string, dto: UpdateRuleDto): Promise<RuleDocument> {
    const updated = await this.ruleRepository.updateRule(id, dto);
    if (!updated) throw new NotFoundException('Rule not found');
    await this.refreshCache();
    return updated;
  }

  async deleteRule(id: string): Promise<void> {
    await this.ruleRepository.deleteRule(id);
    await this.refreshCache();
  }

  async findOne(id: string) {
    const rule = await this.ruleRepository.findById(id);
    if (!rule) throw new NotFoundException('Rule not found');
    return rule;
  }

  async findAllActive() {
    return await this.ruleRepository.findAllActive();
  }
  async findAll(page: number, limit: number) {
    return await this.ruleRepository.findAll(page, limit);
  }
  // helpers //
  private async refreshCache() {
    const rules = await this.ruleRepository.findAllActive();
    await this.redisService.saveActiveRules(rules);
  }

  async getActiveRulesFromCache(): Promise<RuleDocument[]> {
    const cached = await this.redisService.getActiveRules();

    if (!cached || cached.length === 0) {
      await this.refreshCache();
      return this.redisService.getActiveRules();
    }

    return cached;
  }

  
}
