import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Poll } from './poll.entity';
import { Vote } from './vote.entity';

@Entity()
export class Option {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;

  @ManyToOne(() => Poll, poll => poll.options, { onDelete: 'CASCADE' })
  poll: Poll;

  @OneToMany(() => Vote, vote => vote.option)
  votes: Vote[];
}
