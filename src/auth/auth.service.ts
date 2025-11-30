import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { RegisterDto } from "./dto/register.dto";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Shop } from "../shops/shop.entity";
import { LoginDto } from "./dto/login.dto";
import { AppConstants } from "src/constants/app.constants";
import { ObjectId } from "mongodb";
import { catchError, from, map, Observable, of, switchMap } from "rxjs";
import { User } from "src/users/user.entity";

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
      throw new BadRequestException("Email already in use");
    }

    const passwordHash = await bcrypt.hash(
      dto.password,
      AppConstants.BCRYPT_SALT_OR_ROUNDS
    );

    const shop = this.shopsRepo.create({
      name: dto.shopName,
      contactNumber: dto.contactNumber,
      email: dto.email,
    });
    await this.shopsRepo.save(shop);

    const user = await this.usersService.save({
      email: dto.email,
      // contactNumber: dto.contactNumber,
      passwordHash,
      // shop
    });

    // const token = await this.signToken(user.id, user.email);
    // return { user, token };
    return false;
  }

  public login(dto: LoginDto): Observable<string> {
    /*const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const token = await this.signToken(user.id, user.email);*/
    return from(this.usersService.findByEmail(dto.email)).pipe(
      map((user) => {
        if (!user) throw new UnauthorizedException("Invalid credentials");
        return user;
      }),
      switchMap((user) =>
        from(bcrypt.compare(dto.password, user.passwordHash)).pipe(
          map((valid) => ({ valid, user }))
        )
      ),
      switchMap(({ user: { email, id }, valid }) => {
        if (!valid) throw new UnauthorizedException("Invalid credentials");
        return this.signToken(id, email);
      })
    );
    // return { token };
    /*
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.signToken(user.id, user.email);
    return { user, token };*/
  }

  private signToken(userId: ObjectId, email: string) {
    const payload = { sub: userId, email, shopId: '000000' };
    return this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET || "devsecret",
      expiresIn: "7d",
    });
  }
}
