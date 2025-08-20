import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/passport/jwt-strategy/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { AuthModule } from './auth/auth.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set('query parser', 'extended');  
  

  if (await app.listen(process.env.PORT ?? 3000)) console.log("Server starting");
  console.log(app.getHttpServer().address());
}
bootstrap();


