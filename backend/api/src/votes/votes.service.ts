import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vote } from '../polls/vote.entity';
import { Poll } from '../polls/poll.entity';
import { Option } from '../polls/option.entity';
import Redis from 'ioredis';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote) private voteRepo: Repository<Vote>,
    @InjectRepository(Poll) private pollRepo: Repository<Poll>,
    @InjectRepository(Option) private optionRepo: Repository<Option>,
  ) {}

  async vote(dto: { pollId: number; optionId: number }) {
    // 1. Vérifier que le sondage existe
    const poll = await this.pollRepo.findOne({ where: { id: dto.pollId } });
    if (!poll) throw new BadRequestException('Poll not found');

    // 2. Vérifier que l’option existe dans ce sondage
    const option = await this.optionRepo.findOne({ where: { id: dto.optionId } });
    if (!option) throw new BadRequestException('Option not found');

    // 3. Créer un objet Vote en mémoire
    const vote = this.voteRepo.create({ poll, option });

    // 4. Sauvegarder le vote dans MySQL
    const savedVote = await this.voteRepo.save(vote);

 const results = await this.optionRepo
    .createQueryBuilder("option")
    .leftJoin("option.votes", "vote")
    .where("option.pollId = :id", { id: dto.pollId })
    .select(["option.id AS id", "option.label AS label"])
    .addSelect("COUNT(vote.id)", "votes")
    .groupBy("option.id")
    .getRawMany();

  // 👉 Publier résultats dans Redis
  const pub = new Redis({ host: process.env.REDIS_HOST || 'localhost' });
  await pub.publish(`poll:${dto.pollId}`, JSON.stringify({
    pollId: dto.pollId,
    results,
  }));

  return { pollId: dto.pollId, results };
  }
}
