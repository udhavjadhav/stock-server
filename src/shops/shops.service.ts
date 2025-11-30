import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shop } from './shop.entity';
import { UpdateShopDto } from './dto/update-shop.dto';
import { User } from '../users/user.entity';

@Injectable()
export class ShopsService {
  constructor(
    @InjectRepository(Shop) private readonly shopsRepo: Repository<Shop>
  ) {}

  async getShopForUser(userId: number) {
    const shop = await this.shopsRepo.findOne({
      where: { owner: { id: userId } }
    });
    if (!shop) throw new NotFoundException('Shop not found');
    return shop;
  }

  async updateShopForUser(user: User, dto: UpdateShopDto) {
    const shop = await this.getShopForUser(user.id);
    Object.assign(shop, dto);
    return this.shopsRepo.save(shop);
  }
}
