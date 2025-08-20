import { Body, Controller, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { RegisterDto } from '../dto/RegisterDto';
import { AuthService } from './auth.service';
import { Public } from './guard/roles.decorator';
import { LocalAuthGuard } from './passport/local-strategy/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('check')
  async check(@Request() req){
    return req.user
   }
  
  @Public()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async logIn(@Request() request): Promise<object> {
    console.log("In controller\n",request.user);
    return this.authService.login(request.user.username,request.user.password);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(@Body() userData: RegisterDto): Promise<object> {
    return this.authService.register(userData);
  }
}
