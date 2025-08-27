// src/sensor/mqtt/mqtt2.service.ts
import {
    Injectable,
    Logger,
    OnApplicationShutdown,
    OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mqtt from 'mqtt';
import { QoS } from 'mqtt-packet';
import { SensorDataDto } from 'src/dto/sensor.dto';
import { WsGateway } from 'src/sensor/ws/ws.gateway';
import { SensorService } from '../sensor.service';

type SensorTopic = 'humidity' | 'temperature' | 'leds' | 'led';

@Injectable()
export class MqttService implements OnModuleInit, OnApplicationShutdown {
  private client?: mqtt.MqttClient;
  private readonly logger = new Logger(MqttService.name);
  private readonly topics: SensorTopic[] = ['humidity', 'temperature', 'leds'];

  private readyResolve!: () => void;
  private readyReject!: (e: any) => void;
  private readonly ready = new Promise<void>((res, rej) => {
    this.readyResolve = res;
    this.readyReject = rej;
  });

  // keep topics configurable

  constructor(
    private cfg: ConfigService,
    private readonly wsGateway: WsGateway,
    private readonly sensorService: SensorService,
  ) {}

  onModuleInit() {
    const url = this.cfg.get<string>('MQTT_URL');
    const username = this.cfg.get<string>('MQTT_USERNAME');
    const password = this.cfg.get<string>('MQTT_PASSWORD');

    if (!url) {
      const msg = 'MQTT_URL is not set';
      this.logger.error(msg);
      this.readyReject(new Error(msg));
      return;
    }

    this.client = mqtt.connect(url, {
      username,
      password,
      clean: true,
      reconnectPeriod: 2000,
      connectTimeout: 10_000,
    });

    this.client.on('connect', async () => {
      this.logger.log(`MQTT connected to ${url}`);
      this.readyResolve();

      for (const topic of this.topics) {
        void this.subscribe(topic, (msg, t) => this.handleMessage(t, msg), 0);
      }
    });

    this.client.on('reconnect', () => this.logger.warn('MQTT reconnecting...'));
    this.client.on('close', () => this.logger.warn('MQTT connection closed'));
    this.client.on('offline', () => this.logger.warn('MQTT offline'));
    this.client.on('error', (e) => {
      this.logger.error(`MQTT error: ${e?.message || e}`);
      this.readyReject(e);
    });
  }

  private async handleMessage(topic: string, data: any) {
    try {
      const gardenId = Number(data.gardenId ?? data.garderID ?? data.gardenID);
      const recordedAt = data.recordedAt
        ? new Date(data.recordedAt)
        : new Date();

      if (topic === 'temperature' || topic === 'humidity') {
        const value = Number(data.value);
        if (!gardenId || Number.isNaN(value)) {
          this.logger.warn(
            `Invalid sensor payload on ${topic}: ${JSON.stringify(data)}`,
          );
          return;
        }

        const dto: SensorDataDto = {
          type: topic, 
          value,
          gardenId,
          recordedAt: recordedAt.toISOString(),
        };

        this.wsGateway.emitSensorUpdate({ topic, value: dto });

        await this.sensorService.create(dto);
        return;
      }

      if (topic === 'leds' || topic === 'led') {
        const ledDto = {
          gardenId,
          recordedAt: new Date().toISOString(),
          led1State: data.led1State,
          led2State: data.led2State,
          led3State: data.led3State,
        };

        this.wsGateway.emitSensorUpdate({ topic: 'led', value: ledDto });
        return;
      }
    } catch (e: any) {
      this.logger.error(
        `Failed to process message on ${topic}: ${e?.message || e}`,
      );
    }
  }

  async publish(topic: string, payload: any, qos: QoS = 0, retain = false) {
    await this.ready;
    return new Promise<void>((resolve, reject) => {
      this.client!.publish(
        topic,
        typeof payload === 'string' ? payload : JSON.stringify(payload),
        { qos, retain },
        (err) => {
          if (err) return reject(err);
          this.logger.log(
            `Published to "${topic}" (qos=${qos}, retain=${retain})`,
          );
          resolve();
        },
      );
    });
  }

  async subscribe(
    topic: string,
    cb: (msg: any, topic: string) => void,
    qos: QoS = 0,
  ) {
    await this.ready;
    await new Promise<void>((resolve, reject) => {
      this.client!.subscribe(topic, { qos }, (err) =>
        err ? reject(err) : resolve(),
      );
    });

    const handler = (t: string, m: Buffer) => {
      if (t !== topic) return; // only handle this topic here
      try {
        cb(JSON.parse(m.toString()), t);
      } catch {
        cb(m.toString(), t);
      }
    };

    this.client!.on('message', handler);

    return () => {
      this.client?.off('message', handler);
      this.client?.unsubscribe(topic, (err) => {
        if (err)
          this.logger.error(`Failed to unsubscribe ${topic}: ${err.message}`);
      });
    };
  }

  onApplicationShutdown() {
    if (this.client) {
      this.logger.log('Closing MQTT connection...');
      this.client.end(true);
    }
  }
}
