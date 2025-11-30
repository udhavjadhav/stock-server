import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Sale } from './sale.entity';
import { Product } from '../products/product.entity';

@Entity()
export class SaleItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Sale, (sale) => sale.items)
  sale: Sale;

  @ManyToOne(() => Product, (product) => product.saleItems)
  product: Product;

  @Column('int')
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice: number;

  @Column('decimal', { precision: 10, scale: 2 })
  lineTotal: number;
}
