import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>
  ) {}

  findByEmail(email: string) {
    return this.usersRepo.findOne({
      where: { email },
    });
  }

  findById(id: number) {
    // return this.usersRepo.findOne({
    //   where: { id },
    //   relations: ['shop']
    // });

  }

  save(user: Partial<User>) {
    return this.usersRepo.save(user);
  }
}
