import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { VegetablesController } from './vegetables.controller';
import { VegetablesService } from './vegetables.service';

@Module({
  controllers: [VegetablesController],
  providers: [VegetablesService, PrismaService],
  exports: [VegetablesService],
})
export class VegetablesModule {}
