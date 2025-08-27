import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class GardenDto {

  @ApiProperty({ example: 'My Garden' })
  @IsString()
  name: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  ownerId: number;
}