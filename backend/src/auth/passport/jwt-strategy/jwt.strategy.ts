import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConst } from '../../constant';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt') {
  constructor(){
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConst
    });
  }

  //put this into request['user']
  async validate(payload: { username: string, email: string }): Promise<{ username: string,email: string  }> {
    return { username: payload.username,
             email: payload.email
     };
  }

}