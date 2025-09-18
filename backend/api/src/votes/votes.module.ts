import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VotesController } from './votes.controller';
import { VotesService } from './votes.service';
import { Vote } from '../polls/vote.entity';
import { Poll } from '../polls/poll.entity';
import { Option } from '../polls/option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vote, Poll, Option])],
  controllers: [VotesController],
  providers: [VotesService],
})
export class VotesModule {}
