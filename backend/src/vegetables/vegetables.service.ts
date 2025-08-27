import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { PriceDto } from 'src/dto/price.dto';
import { VegetableDto } from 'src/dto/vegetable.dto';

@Injectable()
export class VegetablesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.vegetable.findMany({
      include: { garden: true },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const veg = await this.prisma.vegetable.findUnique({
      where: { id },
      include: { garden: true },
    });
    if (!veg) throw new NotFoundException('Vegetable not found');
    return veg;
  }

  async create(dto: VegetableDto) {
    const data: Prisma.VegetableCreateInput = {
      name: dto.name,
      importedQty: dto.importedQty ?? 0,
      soldQty: dto.soldQty ?? 0,
      garden: { connect: { id: dto.gardenId } },
      price: dto.price !== undefined ? dto.price : 0,
    };
    return this.prisma.vegetable.create({ data });
  }

  async update(id: number, dto: VegetableDto) {
    return this.prisma.vegetable.update({
      where: { id },
      data: {
        name: dto.name,
        importedQty: dto.importedQty,
        soldQty: dto.soldQty,
        gardenId: dto.gardenId,
        price:
          dto.price !== undefined ? new Prisma.Decimal(dto.price) : undefined,
      },
    });
  }

  async updateQty(id: number, dto: VegetableDto) {
    return this.prisma.vegetable.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    return this.prisma.vegetable.delete({ where: { id } });
  }

  // Price

  async setPrice(id: number, dto: PriceDto) {
    return this.prisma.vegetable.update({
      where: { id },
      data: { price: new Prisma.Decimal(dto.price) },
      select: { id: true, name: true, price: true },
    });
  }

  async getPrice(id: number) {
    const veg = await this.prisma.vegetable.findUnique({
      where: { id },
      select: { id: true, name: true, price: true },
    });
    if (!veg) throw new NotFoundException('Vegetable not found');
    return veg;
  }

  async clearPrice(id: number) {
    return this.prisma.vegetable.update({
      where: { id },
      data: { price: 0.0 },
      select: { id: true, name: true, price: true },
    });
  }

  async listCurrentPrices() {
    return this.prisma.vegetable.findMany({
      select: { id: true, name: true, price: true, gardenId: true },
      orderBy: { name: 'asc' },
    });
  }
}
