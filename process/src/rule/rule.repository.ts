import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Rule, RuleDocument } from './rule.schema';
import { Model } from 'mongoose';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';

@Injectable()
export class RuleRepository {
  constructor(
    @InjectModel(Rule.name)
    private readonly ruleModel: Model<RuleDocument>,
  ) {}

  async createRule(dto: CreateRuleDto): Promise<RuleDocument> {
    return this.ruleModel.create(dto);
  }

  async updateRule(
    id: string,
    dto: UpdateRuleDto,
  ): Promise<RuleDocument | null> {
    return this.ruleModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async deleteRule(id: string): Promise<void> {
    await this.ruleModel.findByIdAndDelete(id);
  }

  async findById(id: string) {
    return this.ruleModel.findById(id).lean();
  }

  async findAllActive() {
    return this.ruleModel.find({ isActive: true }).lean();
  }

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.ruleModel
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      this.ruleModel.countDocuments(),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findRulesForAgent(agentId: string) {
    return this.ruleModel
      .find({
        isActive: true,
        $or: [{ agentId }, { agentId: null }, { agentId: { $exists: false } }],
      })
      .lean();
  }
}
