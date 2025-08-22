import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class RegisterDto {
  @IsString()
  @ApiProperty({ example: 'Johny Le' })
  name: string;

  @IsString()
  @ApiProperty({ example: 'gosei' })
  username: string;

  @IsEmail()
  @ApiProperty({ example: 'takeru@example.com' })
  email: string;

  @IsString()
  @ApiProperty({ example: 'thispass' })
  password: string;

  @IsOptional()
  @IsString()
  hashedPassword: string;

  @IsString()
  @ApiProperty({ example: 'admin' })
  role: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Fullstack engineer from Hanoi' })
  bio?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...' })
  avatar?: string;
}
