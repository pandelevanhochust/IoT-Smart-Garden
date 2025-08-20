import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './passport/jwt-strategy/jwt.strategy';
import { LocalStrategy } from './passport/local-strategy/local.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule, 
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        global: true,
        secret: cfg.getOrThrow<string>('SECRET'),
        signOptions: { expiresIn: cfg.get<string>('JWT_EXPIRES_IN') ?? '1d' },
      }),
    }),],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy,LocalStrategy]
})
export class AuthModule {}
