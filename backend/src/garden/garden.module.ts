import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { GardenController } from './garden.controller';
import { GardenService } from './garden.service';

@Module({
  controllers: [GardenController],
  providers: [GardenService, PrismaService],
  exports: [GardenService],
})
export class GardenModule {}
