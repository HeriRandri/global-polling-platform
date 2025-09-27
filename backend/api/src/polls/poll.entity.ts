import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Option } from './option.entity';
import { Vote } from '../votes/vote.entity';
import { User } from '../users/user.entity';

@Entity()
export class Poll {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Option, option => option.poll, { cascade: true })
  options: Option[];

  @OneToMany(() => Vote, vote => vote.poll)
  votes: Vote[];

  @ManyToOne(() => User, user => user.polls, { onDelete: 'CASCADE' })
  owner: User;

  @Column({ type: 'timestamp', nullable: true })
  closedAt: Date;
  
   @Column({ type: 'timestamp', nullable: true })
  expiresAt?: Date;
}
