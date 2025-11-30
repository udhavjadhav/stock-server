import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './sale.entity';
import { SaleItem } from './sale-item.entity';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { Product } from '../products/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sale, SaleItem, Product])],
  providers: [SalesService],
  controllers: [SalesController],
  exports: [SalesService]
})
export class SalesModule {}
