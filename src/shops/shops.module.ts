import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shop } from './shop.entity';
import { ShopsService } from './shops.service';
import { ShopsController } from './shops.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Shop])],
  providers: [ShopsService],
  controllers: [ShopsController],
  exports: [ShopsService]
})
export class ShopsModule {}
