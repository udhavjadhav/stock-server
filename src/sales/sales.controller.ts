import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { SalesService } from './sales.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { CreateSaleDto } from './dto/create-sale.dto';

@Controller('sales')
@UseGuards(JwtAuthGuard)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  create(@CurrentUser() user: User, @Body() dto: CreateSaleDto) {
    return this.salesService.create(user, dto);
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.salesService.findAllForUser(user);
  }

  @Get(':id')
  findOne(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.salesService.findOneForUser(user, id);
  }
}
