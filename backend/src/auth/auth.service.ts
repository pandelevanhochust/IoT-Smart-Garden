import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from '../dto/RegisterDto';

@Injectable()
export class AuthService {
    constructor(private userService: UserService,private jwtService: JwtService) {}

    async login(username: string, pass: string) {
        const user = await this.userService.findUserbyUsername(username);
        if (!user) throw new UnauthorizedException('User not found');

        const hashedpasswordMatch = await bcrypt.compare(pass,user.hashedPassword);
        const passwordMatch = user.password === pass;

        if(!(hashedpasswordMatch)){
            throw new UnauthorizedException('Wrong password');
        }
        const { password, ...result} = user;
        const token = await this.jwtService.signAsync(result);

        return {
        msg: 'Successfully logged in',
        user: {
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
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
