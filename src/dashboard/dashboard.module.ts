import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Sale } from '../sales/sale.entity';
import { Product } from '../products/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sale, Product])],
  providers: [DashboardService],
  controllers: [DashboardController]
})
export class DashboardModule {}
