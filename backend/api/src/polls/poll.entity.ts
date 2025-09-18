import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Option } from './option.entity';

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
}
