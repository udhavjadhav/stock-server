import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { User } from '../users/user.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepo: Repository<Product>
  ) {}

  async create(user: User, dto: CreateProductDto) {
    const product = this.productsRepo.create({
      ...dto,
      shop: user.shop
    });
    return this.productsRepo.save(product);
  }

  findAllForUser(user: User) {
    return this.productsRepo.find({ where: { shop: { id: user.shop.id } } });
  }

  async findOneForUser(user: User, id: number) {
    const product = await this.productsRepo.findOne({
      where: { id, shop: { id: user.shop.id } }
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(user: User, id: number, dto: UpdateProductDto) {
    const product = await this.findOneForUser(user, id);
    Object.assign(product, dto);
    return this.productsRepo.save(product);
  }

  async remove(user: User, id: number) {
    const product = await this.findOneForUser(user, id);
    await this.productsRepo.remove(product);
    return { deleted: true };
  }

  findLowStock(user: User) {
    return this.productsRepo.find({
      where: {
        shop: { id: user.shop.id }
      }
    });
  }
}
