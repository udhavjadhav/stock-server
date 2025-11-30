import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Shop } from '../shops/shop.entity';
import { SaleItem } from './sale-item.entity';

@Entity()
export class Sale {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  invoiceNumber: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  customerName: string;

  @Column({ nullable: true })
  customerContact: string;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  discount: number;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @ManyToOne(() => Shop)
  shop: Shop;

  @OneToMany(() => SaleItem, (item) => item.sale, { cascade: true })
  items: SaleItem[];
}
