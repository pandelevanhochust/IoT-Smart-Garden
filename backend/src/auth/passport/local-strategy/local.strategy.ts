import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from './../../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy,'local'){
    constructor(private AuthService: AuthService){
        super({
            usernameField: 'email',
            passwordField: 'password'
        });
    }
    async validate(email: string, password: string): Promise<any> {
        const user = await this.AuthService.validateEmailPassword(email,password);
        if(!user){
            throw new UnauthorizedException("Email Password mismatched");
        }
        console.log("In local strategy\n",user);
        return user;
    }
} 
