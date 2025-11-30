import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@CurrentUser() user: User, @Body() dto: CreateProductDto) {
    return this.productsService.create(user, dto);
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.productsService.findAllForUser(user);
  }

  @Get(':id')
  findOne(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.productsService.findOneForUser(user, id);
  }

  @Put(':id')
  update(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto
  ) {
    return this.productsService.update(user, id, dto);
  }

  @Delete(':id')
  remove(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.productsService.remove(user, id);
  }
}
