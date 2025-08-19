import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from './../../auth.service';
import { User } from '@prisma/client';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy,'local'){
    constructor(private AuthService: AuthService){
        super({
            usernameField: 'username',
            passwordField: 'password'
        });
    }

    async validate(username: string, password: string): Promise<any> {
        const user = await this.AuthService.validateUsernamePassword(username,password);
        if(!user){
            throw new UnauthorizedException("Username Password mismatched");
        }
        console.log("In local strategy\n",user);
        return user;
    }
} 