import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PollsService } from './polls.service';

@Controller('polls')
export class PollsController {
  constructor(private pollsService: PollsService) {}

  @Post()
  createPoll(@Body() dto: { title: string; description?: string; options: string[] }) {
    return this.pollsService.createPoll(dto);
  }

  @Get(':id')
  getPoll(@Param('id') id: number) {
    return this.pollsService.getPoll(id);
  }
  @Get(':id/results')
getResults(@Param('id') id: number) {
  return this.pollsService.getResults(id);
}

}
