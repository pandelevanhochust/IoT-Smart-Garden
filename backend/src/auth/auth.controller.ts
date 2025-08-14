import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LoginDto } from '../dto/LoginDto';
import { RegisterDto } from '../dto/RegisterDto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  logIn(@Body() loginDto: LoginDto): Promise<object> {
    return this.authService.login(loginDto.username, loginDto.password);
  }

  @Post('register')
  register(@Body() userData: RegisterDto): Promise<object> {
    return this.authService.register(userData);
  }
}
