import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import * as Joi from 'joi';
import { PrismaModule } from 'prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RolesGuard } from './auth/guard/roles.guard';
import { JwtAuthGuard } from './auth/passport/jwt-strategy/jwt-auth.guard';
import { GardenModule } from './garden/garden.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { SaleModule } from './sale/sale.module';
import { SensorModule } from './sensor/sensor.module';
import { UserModule } from './user/user.module';
import { VegetablesModule } from './vegetables/vegetables.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        SECRET: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.string().default('1d'),
      }),
    }),
    UserModule,
    AuthModule,
    PrismaModule,
    GardenModule,
    SaleModule,
    SensorModule,
    VegetablesModule,
  ],

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
    AppService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: 'api/user', method: RequestMethod.ALL });
    // .forRoutes(StaffController)
  }
}
