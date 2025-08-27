import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { SaleDto } from 'src/dto/sale.dto';

@Injectable()
export class SaleService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.sale.findMany();
  }

  async findOne(id: number) {
    return this.prisma.sale.findUnique({ where: { id } });
  }

  async create(dto: SaleDto) {
    const { gardenId, vegetableId, quantity, totalAmount, soldAt, createdAt } =
      dto;
    return this.prisma.sale.create({
      data: {
        gardenId,
        vegetableId,
        quantity,
        totalAmount: totalAmount ? totalAmount.toString() : '0.00',
        soldAt: soldAt ? new Date(soldAt) : undefined,
        createdAt: createdAt ? new Date(createdAt) : undefined,
      },
    });
  }

  async update(id: number, dto: SaleDto) {
    const { gardenId, vegetableId, quantity, totalAmount, soldAt, createdAt } =
      dto;
    return this.prisma.sale.update({
      where: { id },
      data: {
        gardenId,
        vegetableId,
        quantity,
        totalAmount: totalAmount ? totalAmount.toString() : undefined,
        soldAt: soldAt ? new Date(soldAt) : undefined,
        createdAt: createdAt ? new Date(createdAt) : undefined,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.sale.delete({ where: { id } });
  }
}
