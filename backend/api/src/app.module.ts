import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Poll } from './polls/poll.entity';
import { Option } from './polls/option.entity';
import { Vote } from './polls/vote.entity';
import { User } from './users/user.entity';
import { PollsModule } from './polls/polls.module';
import { VotesModule } from './votes/votes.module';
import { VotesGateway } from './votes/votes.gateway';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: 3306,
      username: process.env.DB_USER || 'dev',
      password: process.env.DB_PASS || 'devpass',
      database: process.env.DB_NAME || 'polling',
      entities: [Poll, Option, Vote, User],
      synchronize: true, // ⚠️ auto-create tables (dev only)
    }),
     PollsModule,
    VotesModule
  ],
    providers: [VotesGateway], // 👈 ajoute ça
})
export class AppModule {}
