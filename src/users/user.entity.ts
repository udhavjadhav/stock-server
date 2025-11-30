import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Shop } from '../shops/shop.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  contactNumber: string;

  @OneToOne(() => Shop, (shop) => shop.owner, { cascade: true })
  shop: Shop;
}
