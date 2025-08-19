import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './passport/jwt-strategy/jwt.strategy';
import { LocalStrategy } from './passport/local-strategy/local.strategy';

@Module({
  imports: [UserModule,
            PassportModule, 
            JwtModule.register({
              global: true,
              secret: process.env.SECRET,
              signOptions: {
                  expiresIn: '30s',
              }
            })],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy,LocalStrategy]
})
export class AuthModule {}
