import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Option } from '../polls/option.entity';
import { Poll } from '../polls/poll.entity';

@Entity()
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.votes, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Option, option => option.votes, { onDelete: 'CASCADE' })
  option: Option;

  @ManyToOne(() => Poll, poll => poll.votes, { onDelete: 'CASCADE' })
  poll: Poll;
}
