import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal } from 'class-validator';

export class PriceDto {
  @ApiProperty({ example: 3.25 })
  @IsDecimal()
  price: number;
}
