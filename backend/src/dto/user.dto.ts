import { IsEmail, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  name: string;

  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}