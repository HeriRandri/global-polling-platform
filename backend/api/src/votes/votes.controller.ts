import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { VotesService } from './votes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('votes')
export class VotesController {
  constructor(private votesService: VotesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  vote(
    @Body() dto: { pollId: number; optionId: number },
    @Req() req: any,
  ) {
    const userId = req.user.userId; // ✅ pris depuis le token JWT
    return this.votesService.vote({ ...dto, userId });
  }
}
