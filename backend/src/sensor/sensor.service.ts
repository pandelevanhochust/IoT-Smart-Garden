import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { LedControlDto } from 'src/dto/led-control.dto';
import { SensorDataDto } from 'src/dto/sensor.dto';

@Injectable()
export class SensorService {
  constructor(
    private readonly prisma: PrismaService,
    // private readonly mqtt: MqttService
  ) {}

  async findAll() {
    return this.prisma.sensorData.findMany();
  }

  async findOne(id: number) {
    return this.prisma.sensorData.findUnique({ where: { id } });
  }

  async create(dto: SensorDataDto) {
    return this.prisma.sensorData.create({
      data: {
        type: dto.type,
        value: dto.value,
        garden: { connect: { id: dto.gardenId } },
        recordedAt: dto.recordedAt
          ? new Date(dto.recordedAt).toISOString()
          : new Date().toISOString(),
      },
    });
  }

  async update(id: number, dto: SensorDataDto) {
    return this.prisma.sensorData.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    return this.prisma.sensorData.delete({ where: { id } });
  }

  async history(gardenId: number, from?: Date, to?: Date) {
    return this.prisma.sensorData.findMany({
      where: {
        gardenId,
        ...(from || to ? { recordedAt: { gte: from, lte: to } } : {}),
      },
      orderBy: { recordedAt: 'desc' },
      take: 500,
    });
  }

  async controlLed(data: LedControlDto) {
    const payload: LedControlDto = {
      gardenId: data.gardenId,
      recordedAt: new Date().toISOString(),
      led1State: data.led1State,
      led2State: data.led2State,
      led3State: data.led3State,
    };

    // await this.mqtt.publish('leds', payload, 0, false);

    return { msg: 'Command sent', payload };
  }
}
