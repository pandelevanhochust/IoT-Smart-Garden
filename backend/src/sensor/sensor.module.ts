import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { MqttService } from './mqtt/mqtt2.service';
import { SensorController } from './sensor.controller';
import { SensorService } from './sensor.service';
import { WsGateway } from './ws/ws.gateway';

@Module({
  imports: [],
  controllers: [SensorController],
  providers: [SensorService, PrismaService, MqttService, WsGateway],
  exports: [],
})
export class SensorModule {}
