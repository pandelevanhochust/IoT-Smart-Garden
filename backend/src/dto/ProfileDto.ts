import { IsOptional, IsString } from 'class-validator';

export class ProfileDto {
  @IsString()
  bio: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  userId?: number;
}