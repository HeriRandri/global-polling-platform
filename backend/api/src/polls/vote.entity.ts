import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Poll } from './poll.entity';
import { Option } from './option.entity';
import { User } from '../users/user.entity';

@Entity()
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Poll, { onDelete: 'CASCADE' })
  poll: Poll;

  @ManyToOne(() => Option, { onDelete: 'CASCADE' })
  option: Option;

  @ManyToOne(() => User, { nullable: true })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
