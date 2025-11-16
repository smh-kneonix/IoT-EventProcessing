import { Controller, Get, Param, Query } from '@nestjs/common';
import { EventService } from './event.service';

@Controller('event')
export class EventController {
  constructor(public eventService: EventService) {}

  @Get('agent/:agentId')
  async getEventsByAgent(
    @Param('agentId') agentId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.eventService.getEventsByAgent(
      agentId,
      Number(page),
      Number(limit),
    );
  }

  @Get('rule/:ruleId')
  async getEventsByRule(
    @Param('ruleId') ruleId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.eventService.getEventsByRule(
      ruleId,
      Number(page),
      Number(limit),
    );
  }
}
