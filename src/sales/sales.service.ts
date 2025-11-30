import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from './sale.entity';
import { SaleItem } from './sale-item.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale) private readonly salesRepo: Repository<Sale>,
    @InjectRepository(SaleItem) private readonly itemsRepo: Repository<SaleItem>,
    @InjectRepository(Product) private readonly productsRepo: Repository<Product>
  ) {}

  private async generateInvoiceNumber(): Promise<string> {
    const count = await this.salesRepo.count();
    const num = count + 1;
    return 'INV-' + num.toString().padStart(6, '0');
  }

  async create(user: User, dto: CreateSaleDto) {
    if (!user.shop) {
      throw new BadRequestException('User has no shop');
    }

    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Sale must have at least one item');
    }

    const products = await this.productsRepo.findByIds(
      dto.items.map((i) => i.productId)
    );

    const productMap = new Map(products.map((p) => [p.id, p]));
    let subtotal = 0;

    for (const item of dto.items) {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new BadRequestException(`Product ${item.productId} not found`);
      }
      if (product.quantity < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product ${product.name}`
        );
      }
      subtotal += Number(product.sellingPrice) * item.quantity;
    }

    const discount = dto.discount || 0;
    const total = subtotal - discount;

    const sale = this.salesRepo.create({
      invoiceNumber: await this.generateInvoiceNumber(),
      customerName: dto.customerName,
      customerContact: dto.customerContact,
      subtotal,
      discount,
      total,
      shop: user.shop
    });

    const savedSale = await this.salesRepo.save(sale);

    const saleItems: SaleItem[] = [];
    for (const item of dto.items) {
      const product = productMap.get(item.productId)!;
      const lineTotal = Number(product.sellingPrice) * item.quantity;

      const saleItem = this.itemsRepo.create({
        sale: savedSale,
        product,
        quantity: item.quantity,
        unitPrice: product.sellingPrice,
        lineTotal
      });
      saleItems.push(saleItem);

      product.quantity -= item.quantity;
      await this.productsRepo.save(product);
    }

    await this.itemsRepo.save(saleItems);

    const withItems = await this.salesRepo.findOne({
      where: { id: savedSale.id },
      relations: ['items', 'items.product']
    });

    return withItems;
  }

  findAllForUser(user: User) {
    return this.salesRepo.find({
      where: { shop: { id: user.shop.id } },
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' }
    });
  }

  findOneForUser(user: User, id: number) {
    return this.salesRepo.findOne({
      where: { id, shop: { id: user.shop.id } },
      relations: ['items', 'items.product']
    });
  }
}
