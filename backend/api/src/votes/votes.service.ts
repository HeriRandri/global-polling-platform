import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vote } from '../polls/vote.entity';
import { Poll } from '../polls/poll.entity';
import { Option } from '../polls/option.entity';
import { User } from '../users/user.entity';
import Redis from 'ioredis';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote) private voteRepo: Repository<Vote>,
    @InjectRepository(Poll) private pollRepo: Repository<Poll>,
    @InjectRepository(Option) private optionRepo: Repository<Option>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  // src/votes/votes.service.ts
async vote(dto: { pollId: number; optionId: number; userId: number }) {
  // 1. Vérifier que le poll existe
  const poll = await this.pollRepo.findOne({ where: { id: dto.pollId } });
  if (!poll) throw new BadRequestException('Poll not found');

    if (poll.expiresAt && poll.expiresAt < new Date()) {
    throw new BadRequestException('Poll has expired');
  }
  // 2. Vérifier que l’option existe
  const option = await this.optionRepo.findOne({ where: { id: dto.optionId } });
  if (!option) throw new BadRequestException('Option not found');

  // 3. Vérifier si l’utilisateur a déjà voté pour ce poll
  const existing = await this.voteRepo.findOne({
    where: { poll: { id: dto.pollId }, user: { id: dto.userId } },
  });
  if (existing) {
    throw new BadRequestException('User already voted on this poll');
  }

  // 4. Créer le vote
  const vote = this.voteRepo.create({ poll, option, user: { id: dto.userId } as any });
  await this.voteRepo.save(vote);

  // 5. Recalculer résultats
  const results = await this.optionRepo
    .createQueryBuilder("option")
    .leftJoin("option.votes", "vote")
    .where("option.pollId = :id", { id: dto.pollId })
    .select(["option.id AS id", "option.label AS label"])
    .addSelect("COUNT(vote.id)", "votes")
    .groupBy("option.id")
    .getRawMany();

  return { pollId: dto.pollId, results };
}


  // async vote(dto: { pollId: number; optionId: number; userId: number }) {
  //   // 1. Vérifier que le sondage existe
  //   const poll = await this.pollRepo.findOne({ where: { id: dto.pollId } });
  //   if (!poll) throw new BadRequestException('Poll not found');

  //   // 2. Vérifier que l’option existe et correspond au sondage
  //   const option = await this.optionRepo.findOne({
  //     where: { id: dto.optionId },
  //     relations: ['poll'],
  //   });
  //   if (!option || option.poll.id !== dto.pollId) {
  //     throw new BadRequestException('Option not found in this poll');
  //   }

  //   // 3. Vérifier si l’utilisateur a déjà voté
  //   const existingVote = await this.voteRepo.findOne({
  //     where: { option: { poll: { id: dto.pollId } }, user: { id: dto.userId } },
  //     relations: ['option', 'user'],
  //   });
  //   if (existingVote) {
  //     throw new BadRequestException('User has already voted in this poll');
  //   }

  //   // 4. Créer le vote
  //   const user = await this.userRepo.findOne({ where: { id: dto.userId } });
  //   if (!user) {
  //     throw new BadRequestException('User not found');
  //   }
  //   const vote = this.voteRepo.create({ option, user });

  //   const savedVote = await this.voteRepo.save(vote);

  //   // 5. Recalculer résultats
  //   const results = await this.optionRepo
  //     .createQueryBuilder('option')
  //     .leftJoin('option.votes', 'vote')
  //     .where('option.pollId = :id', { id: dto.pollId })
  //     .select(['option.id AS id', 'option.label AS label'])
  //     .addSelect('COUNT(vote.id)', 'votes')
  //     .groupBy('option.id')
  //     .getRawMany();

  //   // 6. Publier via Redis
  //   const pub = new Redis({ host: process.env.REDIS_HOST || 'localhost' });
  //   await pub.publish(`poll:${dto.pollId}`, JSON.stringify({
  //     pollId: dto.pollId,
  //     results,
  //   }));

  //   return { pollId: dto.pollId, results };
  // }
}
