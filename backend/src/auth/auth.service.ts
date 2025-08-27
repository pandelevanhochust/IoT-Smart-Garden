import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../dto/register.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateEmailPassword(email: string, pass: string): Promise<any> {
    const user = await this.userService.findUserbyEmail(email);
    if (!user) throw new UnauthorizedException('Wrong email');
    if (!user.hashedPassword)
      throw new UnauthorizedException('No password set for this user');
    const passwordMatch = await bcrypt.compare(pass, user.hashedPassword);
    if (!passwordMatch) throw new UnauthorizedException('Wrong password');
    const { hashedPassword, ...result } = user;
    return result;
  }

  async login(email: string, pass: string) {
    const user = await this.validateEmailPassword(email, pass);
    if (!user) throw new UnauthorizedException('Email or password incorrect');

    const token = await this.jwtService.signAsync({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    return {
      msg: 'Successfully logged in',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    };
  }

  async register(user: RegisterDto) {
    const existingEmail = await this.userService.findUserbyEmail(user.email);
    if (existingEmail) {
      throw new UnauthorizedException('This email has existed');
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = await this.userService.create({
      ...user,
      hashedPassword: hashedPassword,
    });

    const token = await this.jwtService.signAsync({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    });

    return {
      msg: 'Successfully registered',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        token,
      },
    };
  }
}
