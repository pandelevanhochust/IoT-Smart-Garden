import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { Public } from 'src/decorator/public.decorator';
import { LoginDto } from 'src/dto/LoginDto';
import { RegisterDto } from '../dto/RegisterDto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-strategy/local-auth.guard';

@ApiBearerAuth('JWT-auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('check')
  async check(@Request() req) {
    return req.user;
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginDto })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async logIn(@Request() request): Promise<object> {
    console.log('In controller\n', request.user);
    return this.authService.login(request.user.username, request.user.password);
  }

  @Public()
  @ApiBody({ type: RegisterDto })
  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(@Body() userData: RegisterDto): Promise<object> {
    return this.authService.register(userData);
  }
}
