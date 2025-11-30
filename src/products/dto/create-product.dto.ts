import { IsDateString, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsNumber()
  purchasePrice: number;

  @IsNumber()
  sellingPrice: number;

  @IsInt()
  @Min(0)
  quantity: number;

  @IsInt()
  @Min(0)
  minStockAlert: number;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
