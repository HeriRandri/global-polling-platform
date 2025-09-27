import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Poll } from '../polls/poll.entity';
import { Vote } from '../votes/vote.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  // 🔹 Relation : un utilisateur peut créer plusieurs sondages
  @OneToMany(() => Poll, poll => poll.owner)
  polls: Poll[];

  // 🔹 Relation : un utilisateur peut voter plusieurs fois
  @OneToMany(() => Vote, vote => vote.user)
  votes: Vote[];
}
