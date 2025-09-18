import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PollsController } from './polls.controller';
import { PollsService } from './polls.service';
import { Poll } from './poll.entity';
import { Option } from './option.entity';
import { Vote } from './vote.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Poll, Option, Vote])],
  controllers: [PollsController],
  providers: [PollsService],
  exports: [PollsService], // 👈 utile si VotesService a besoin de PollsService
})
export class PollsModule {}
