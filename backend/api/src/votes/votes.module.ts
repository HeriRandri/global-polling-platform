import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VotesController } from './votes.controller';
import { VotesService } from './votes.service';
import { Vote } from './vote.entity';
import { Poll } from '../polls/poll.entity';
import { Option } from '../polls/option.entity';
import { VotesGateway } from './votes.gateway';
import { UsersModule } from '../users/users.module';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vote, Poll, Option,User]),UsersModule],
  controllers: [VotesController],
  providers: [VotesService,VotesGateway],
})
export class VotesModule {}
