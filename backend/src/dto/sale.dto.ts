import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class SaleDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  gardenId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  vegetableId: number;

  @ApiProperty({ example: 5 })
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: '100.00' })
  @IsString() 
  totalAmount: string;

  @ApiPropertyOptional({ example: '2025-08-26T12:00:00Z' })
  @IsOptional()
  @IsString()
  soldAt?: string;

  @ApiPropertyOptional({ example: '2025-08-26T12:00:00Z' })
  @IsOptional()
  @IsString()
  createdAt?: string;
}
