import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shop } from '../shops/shop.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(Shop) private readonly shopsRepo: Repository<Shop>
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new BadRequestException('Email already in use');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const shop = this.shopsRepo.create({
      name: dto.shopName,
      contactNumber: dto.contactNumber,
      email: dto.email
    });
    await this.shopsRepo.save(shop);

    const user = await this.usersService.save({
      email: dto.email,
      contactNumber: dto.contactNumber,
      passwordHash,
      shop
    });

    const token = await this.signToken(user.id, user.email);
    return { user, token };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.signToken(user.id, user.email);
    return { user, token };
  }

  private signToken(userId: number, email: string) {
    const payload = { sub: userId, email };
    return this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET || 'devsecret',
      expiresIn: '7d'
    });
  }
}
