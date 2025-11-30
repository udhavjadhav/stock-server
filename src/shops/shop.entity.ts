import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';

@Entity()
export class Shop {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  logoUrl: string;

  @Column()
  contactNumber: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  address: string;

  @OneToOne(() => User, (user) => user.shop)
  @JoinColumn()
  owner: User;

  @OneToMany(() => Product, (product) => product.shop)
  products: Product[];
}
