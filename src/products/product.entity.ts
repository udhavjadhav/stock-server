import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Shop } from '../shops/shop.entity';
import { SaleItem } from '../sales/sale-item.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  sku: string;

  @Column({ nullable: true })
  category: string;

  @Column('decimal', { precision: 10, scale: 2 })
  purchasePrice: number;

  @Column('decimal', { precision: 10, scale: 2 })
  sellingPrice: number;

  @Column('int')
  quantity: number;

  @Column('int')
  minStockAlert: number;

  @Column({ type: 'date', nullable: true })
  expiryDate: string | null;

  @Column({ nullable: true })
  unit: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @ManyToOne(() => Shop, (shop) => shop.products)
  shop: Shop;

  @OneToMany(() => SaleItem, (item) => item.product)
  saleItems: SaleItem[];
}
