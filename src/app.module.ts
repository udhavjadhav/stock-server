import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ShopsModule } from './shops/shops.module';
import { ProductsModule } from './products/products.module';
import { SalesModule } from './sales/sales.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { User } from './users/user.entity';
import { Shop } from './shops/shop.entity';
import { Product } from './products/product.entity';
import { Sale } from './sales/sale.entity';
import { SaleItem } from './sales/sale-item.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mongodb',
        url: 'mongodb://localhost:27017/stock-management'
      })
    }),
    AuthModule,
    UsersModule,
    ShopsModule,
    ProductsModule,
    SalesModule,
    DashboardModule
  ]
})
export class AppModule {}
