import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from '../dto/RegisterDto';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService,
                private readonly jwtService: JwtService) {}

    async validateUsernamePassword(username: string, pass: string ): Promise<any>{
        const user = await this.userService.findUserbyUsername(username);
        if(!user) throw new UnauthorizedException('Wrong username');
        const passwordMatch = await bcrypt.compare(pass, user.hashedPassword);
        if (!passwordMatch) throw new UnauthorizedException('Wrong password');
        const { hashedPassword, ...result } = user;
        return user; 
    }

    async login(username: string, pass: string) {

        const user = await  this.validateUsernamePassword(username, pass);
        if(!user) throw new UnauthorizedException('Username Password unmatched');

        const { password, ...result} = user;
        const token = await this.jwtService.signAsync(result);

        return {
        msg: 'Successfully logged in',
        user: {
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            role: user.role,
            token: token
        }
        };
    }

    async register(user: RegisterDto) {
        const existing = await this.userService.findUserbyUsername(user.username);
        if (existing) {
            throw new UnauthorizedException('This username has existed');
        }

        const hashedPassword = await bcrypt.hash(user.password, 10);
        const newUser = await this.userService.createUserWithProfile({
            ...user,
            hashedPassword: hashedPassword,
        });

        console.log('New user created:', newUser);

        const { password, ...userPayload } = newUser;
        const token = await this.jwtService.signAsync(userPayload);

        return {
            msg: 'Successfully registered',
            user: {
                id: newUser.id,
                name: newUser.name,
                username: newUser.username,
                email: newUser.email,
                token,
            },
        };
    }
}
