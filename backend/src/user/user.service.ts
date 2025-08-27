import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UserDto } from 'src/dto/user.dto';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async create(dto: UserDto) {
    return this.prisma.user.create({
      data: dto,
    });
  }

  async update(id: number, dto: UserDto) {
    return this.prisma.user.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }

  async findUserbyEmail(email: string) {
    return this.prisma.user.findFirst({ where: { email } });
  }
}
