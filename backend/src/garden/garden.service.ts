import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { GardenDto } from 'src/dto/garden.dto';

@Injectable()
export class GardenService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.garden.findMany();
  }

  async findOne(id: number) {
    return this.prisma.garden.findUnique({ where: { id } });
  }

  async create(dto: GardenDto) {
    return this.prisma.garden.create({ data: dto });
  }

  async update(id: number, dto: GardenDto) {
    return this.prisma.garden.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    return this.prisma.garden.delete({ where: { id } });
  }
}
