import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ShopsService } from './shops.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { UpdateShopDto } from './dto/update-shop.dto';

@Controller('shops')
@UseGuards(JwtAuthGuard)
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  @Get('me')
  getMyShop(@CurrentUser() user: User) {
    return this.shopsService.getShopForUser(user.id);
  }

  @Put('me')
  updateMyShop(@CurrentUser() user: User, @Body() dto: UpdateShopDto) {
    return this.shopsService.updateShopForUser(user, dto);
  }
}
