import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDecimal, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class VegetableDto {
  @ApiProperty({ example: 'Carrot' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  gardenId: number;

  @ApiPropertyOptional({ example: 100 })
  @IsInt()
  @Min(0)
  @IsOptional()
  importedQty?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  soldQty?: number;

  @ApiPropertyOptional({ example: 2.99 })
  @IsDecimal()
  @IsOptional()
  price?: number; 
}
