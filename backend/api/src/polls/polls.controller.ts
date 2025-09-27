import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { PollsService } from './polls.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('polls')
export class PollsController {
  constructor(private pollsService: PollsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createPoll(@Body() dto: { title: string; description?: string; options: string[] }, @Req() req: any) {
    return this.pollsService.createPoll(dto, req.user.userId);
  }

  @Get(':id')
  getPoll(@Param('id') id: number) {
    return this.pollsService.getPoll(id);
  }

  @Get(':id/results')
  getResults(@Param('id') id: number) {
    return this.pollsService.getResults(id);
  }

  @Get()
  getAllPolls() {
    return this.pollsService.getAllPolls();
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/close')
  closePoll(@Param('id') id: number, @Req() req: any) {
    return this.pollsService.closePoll(id, req.user.userId);
  }
}
