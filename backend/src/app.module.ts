import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/passport/jwt-strategy/jwt-auth.guard';
import { LocalAuthGuard } from './auth/passport/local-strategy/local-auth.guard';
import { RolesGuard } from './auth/guard/roles.guard';

@Module({
  imports: [      
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    UserModule, AuthModule, PostModule, PrismaModule],

  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard, 
    },
    AppService],
    })

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer){
    consumer.apply(LoggerMiddleware)
            .forRoutes({path:'api/user', method: RequestMethod.ALL});
            // .forRoutes(StaffController)
  }
}


