import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export enum LedSwitch {
  On = 'On',
  Off = 'Off',
}

export class LedControlDto {
  @ApiProperty({ example: 1 })
  gardenId: number;

  @ApiProperty({ enum: LedSwitch, example: LedSwitch.On })
  @IsEnum(LedSwitch)
  led1State: LedSwitch;

  @ApiPropertyOptional({ enum: LedSwitch, example: LedSwitch.Off })
  @IsOptional()
  @IsEnum(LedSwitch)
  led2State?: LedSwitch;

  @ApiPropertyOptional({ enum: LedSwitch, example: LedSwitch.On })
  @IsOptional()
  @IsEnum(LedSwitch)
  led3State?: LedSwitch;

  @ApiProperty({ example: new Date().toISOString() })
  @IsOptional()
  recordedAt: string;
}
