import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThan, MoreThanOrEqual, Repository } from 'typeorm';
import { Sale } from '../sales/sale.entity';
import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Sale) private readonly salesRepo: Repository<Sale>,
    @InjectRepository(Product) private readonly productsRepo: Repository<Product>
  ) {}

  async getSummary(user: User) {
    const shopId = user.shop.id;
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    const [todaySales, monthSales, yearSales, totalProducts] = await Promise.all([
      this.salesRepo
        .createQueryBuilder('sale')
        .where('sale.shopId = :shopId', { shopId })
        .andWhere('sale.createdAt BETWEEN :start AND :end', {
          start: startOfToday,
          end: endOfToday
        })
        .select('SUM(sale.total)', 'sum')
        .getRawOne(),
      this.salesRepo
        .createQueryBuilder('sale')
        .where('sale.shopId = :shopId', { shopId })
        .andWhere('sale.createdAt >= :start', { start: startOfMonth })
        .select('SUM(sale.total)', 'sum')
        .getRawOne(),
      this.salesRepo
        .createQueryBuilder('sale')
        .where('sale.shopId = :shopId', { shopId })
        .andWhere('sale.createdAt >= :start', { start: startOfYear })
        .select('SUM(sale.total)', 'sum')
        .getRawOne(),
      this.productsRepo.count({ where: { shop: { id: shopId } } })
    ]);

    const todaySalesAmount = Number(todaySales?.sum || 0);
    const lastMonthSalesAmount = Number(monthSales?.sum || 0);
    const lastYearSalesAmount = Number(yearSales?.sum || 0);

    const now = new Date();
    const twoDaysLater = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 2
    );

    const [lowStock, expiringSoon, expired] = await Promise.all([
      this.productsRepo
        .createQueryBuilder('product')
        .where('product.shopId = :shopId', { shopId })
        .andWhere('product.quantity <= product.minStockAlert')
        .getCount(),
      this.productsRepo.count({
        where: {
          shop: { id: shopId },
          expiryDate: Between(startOfToday, twoDaysLater)
        } as any
      }),
      this.productsRepo.count({
        where: {
          shop: { id: shopId },
          expiryDate: LessThan(startOfToday)
        } as any
      })
    ]);

    return {
      todaySalesAmount,
      totalProducts,
      lastMonthSalesAmount,
      lastYearSalesAmount,
      lowStockCount: lowStock,
      expiringSoonCount: expiringSoon,
      expiredCount: expired
    };
  }
}
