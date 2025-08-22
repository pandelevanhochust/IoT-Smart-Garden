import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiBearerAuth('JWT-auth')
  getHello(@Request() request): string {
    console.log(request);
    return this.appService.getHello();
  }
}



