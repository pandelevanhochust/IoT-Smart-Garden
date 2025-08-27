import { Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SensorService } from '../sensor.service';

@WebSocketGateway({ cors: true })
@Injectable()
export class WsGateway {
  constructor(private readonly sensorService: SensorService) {}
  @WebSocketServer()
  server: Server;

  emitSensorUpdate(data: { topic: string; value:any }) {
    this.server.emit('sensorUpdate', data);
    console.log('Emitted sensor update:', data);
  }
}
