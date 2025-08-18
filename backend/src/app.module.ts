import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, AuthModule, PostModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer){
    consumer.apply(LoggerMiddleware)
            .forRoutes({path:'api/user', method: RequestMethod.ALL});
            // .forRoutes(StaffController)
  }
}


