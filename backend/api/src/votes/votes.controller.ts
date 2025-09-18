import { Controller, Post, Body } from '@nestjs/common';
import { VotesService } from './votes.service';

@Controller('votes')
export class VotesController {
  constructor(private votesService: VotesService) {}

  @Post()
  vote(@Body() dto: { pollId: number; optionId: number; userId?: number }) {
    return this.votesService.vote(dto);
  }
}
