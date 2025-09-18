import { Injectable,NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Poll } from './poll.entity';
import { Option } from './option.entity';

@Injectable()
export class PollsService {
  constructor(
    @InjectRepository(Poll) private pollRepo: Repository<Poll>,
    @InjectRepository(Option) private optionRepo: Repository<Option>,
  ) {}

  async createPoll(dto: { title: string; description?: string; options: string[] }) {
    const poll = this.pollRepo.create({ title: dto.title, description: dto.description });
    await this.pollRepo.save(poll);
    const opts = dto.options.map(label => this.optionRepo.create({ label, poll }));
    await this.optionRepo.save(opts);
    return poll;
  }

  async getPoll(id: number) {
    return this.pollRepo.findOne({ where: { id }, relations: ['options', 'options.votes'] });
  }
  async getResults(id: number) {
  const poll = await this.pollRepo.findOne({
    where: { id },
    relations: ['options', 'options.votes'],
  });

 if (!poll) {
    throw new NotFoundException(`Poll with id ${id} not found`);
  }
  // Transformer les options avec le nombre de votes
  return {
    id: poll.id,
    title: poll.title,
    description: poll.description,
    results: poll.options.map(opt => ({
      id: opt.id,
      label: opt.label,
      votes: opt.votes.length,
    })),
  };
}

}
