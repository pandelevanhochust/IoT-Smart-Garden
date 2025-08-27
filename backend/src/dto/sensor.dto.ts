import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class SensorDataDto {
  @ApiProperty({ example: 'temperature' })
  @IsString()
  type: string;

  @ApiProperty({ example: 23.5 })
  @IsNumber()
  value: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  gardenId: number;

  @ApiPropertyOptional({ example: '2025-08-26T12:00:00Z' })
  @IsOptional()
  @IsString()
  recordedAt?: string;
}
