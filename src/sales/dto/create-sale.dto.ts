import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

class SaleItemInput {
  @IsNumber()
  productId: number;

  @IsNumber()
  quantity: number;
}

export class CreateSaleDto {
  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsString()
  customerContact?: string;

  @IsOptional()
  @IsNumber()
  discount?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaleItemInput)
  items: SaleItemInput[];
}
