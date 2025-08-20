import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt') {
  constructor(private readonly config: ConfigService){
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('SECRET'),
    });
  }

  //put this into request['user']
  async validate(payload: { username: string; email: string; role: string }): Promise<{ username: string; email: string; role: string }> {
    return { username: payload.username,
             email: payload.email,
             role: payload.role
     };
  }
}
