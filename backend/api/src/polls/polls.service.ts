// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Poll } from './poll.entity';
// import { Option } from './option.entity';

// @Injectable()
// export class PollsService {
//   constructor(
//     @InjectRepository(Poll) private pollRepo: Repository<Poll>,
//     @InjectRepository(Option) private optionRepo: Repository<Option>,
//   ) {}

//   async createPoll(dto: { title: string; description?: string; options: string[] }, ownerId?: number) {
//     const poll = this.pollRepo.create({ title: dto.title, description: dto.description });

//     if (ownerId) {
//       (poll as any).owner = { id: ownerId };
//     }

//     await this.pollRepo.save(poll);

//     const opts = dto.options.map(label => this.optionRepo.create({ label, poll }));
//     await this.optionRepo.save(opts);

//     // ✅ Retourner le poll complet avec ses options et IDs
//     return this.pollRepo.findOne({
//       where: { id: poll.id },
//       relations: ['options'],
//     });
//   }

//   async getPoll(id: number) {
//     return this.pollRepo.findOne({ where: { id }, relations: ['options', 'options.votes'] });
//   }

//   async getResults(id: number) {
//     const poll = await this.pollRepo.findOne({
//       where: { id },
//       relations: ['options', 'options.votes'],
//     });

//     if (!poll) {
//       throw new NotFoundException(`Poll with id ${id} not found`);
//     }

//     return {
//       id: poll.id,
//       title: poll.title,
//       description: poll.description,
//       results: poll.options.map(opt => ({
//         id: opt.id,
//         label: opt.label,
//         votes: opt.votes.length,
//       })),
//     };
//   }

//   async getAllPolls() {
//     return this.pollRepo.find({ relations: ['options'] });
//   }
// }

// src/polls/polls.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
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
// src/polls/polls.service.ts
async createPoll(
  dto: { title: string; description?: string; options: string[]; expiresAt?: string },
  ownerId?: number,
) {
  const poll = this.pollRepo.create({
    title: dto.title,
    description: dto.description,
    expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
  });

  if (ownerId) poll.owner = { id: ownerId } as any;

  await this.pollRepo.save(poll);

  const opts = dto.options.map((label) => this.optionRepo.create({ label, poll }));
  await this.optionRepo.save(opts);

  return this.pollRepo.findOne({ where: { id: poll.id }, relations: ['options'] });
}



  async getPoll(id: number) {
    return this.pollRepo.findOne({ where: { id }, relations: ['options', 'options.votes'] });
  }

  async getAllPolls() {
    return this.pollRepo.find({ relations: ['options'] });
  }

  // 👇 Clôturer un sondage
  async closePoll(id: number, userId: number) {
    const poll = await this.pollRepo.findOne({ where: { id }, relations: ['owner'] });
    if (!poll) throw new NotFoundException(`Poll ${id} not found`);

    // Seul l’owner peut clôturer
    if (poll.owner.id !== userId) {
      throw new BadRequestException('Not authorized to close this poll');
    }

    if (poll.closedAt) {
      throw new BadRequestException('Poll already closed');
    }

    poll.closedAt = new Date();
    console.log('Poll closed at', poll.closedAt);
    
    return this.pollRepo.save(poll);
  }

  async getResults(id: number) {
  const poll = await this.pollRepo.findOne({
    where: { id },
    relations: ['options', 'options.votes'],
  });

  if (!poll) {
    throw new NotFoundException(`Poll with id ${id} not found`);
  }

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
