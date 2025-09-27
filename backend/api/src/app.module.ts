import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Poll } from './polls/poll.entity';
import { Option } from './polls/option.entity';
import { Vote } from './votes/vote.entity';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PollsModule } from './polls/polls.module';
import { VotesModule } from './votes/votes.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || 'root',
      database: process.env.DB_NAME || 'polling',
      entities: [User, Poll, Option, Vote],  // 🔥 bien mettre toutes les entités ici
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    PollsModule,
    VotesModule,
  ],
})
export class AppModule {}
