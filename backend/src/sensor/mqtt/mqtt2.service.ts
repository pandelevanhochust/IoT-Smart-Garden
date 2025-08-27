import {
  Injectable,
  Logger,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import * as mqtt from 'mqtt';
import { SensorDataDto } from 'src/dto/sensor.dto';
import { WsGateway } from 'src/sensor/ws/ws.gateway';
import { SensorService } from '../sensor.service';

type SensorTopic = 'humidity' | 'temperature' | 'leds';

@Injectable()
export class MqttService implements OnModuleInit, OnApplicationShutdown {
  private client: mqtt.MqttClient;
  private readonly logger = new Logger(MqttService.name);
  private readonly topics: SensorTopic[] = ['humidity', 'temperature', 'leds'];

  constructor(
    private readonly wsGateway: WsGateway,
    private readonly sensorService: SensorService,
  ) {}

  onModuleInit() {
    const options: mqtt.IClientOptions = {
      reconnectPeriod: 2_000,
      keepalive: 60,
      clean: true,
    };

    this.client = mqtt.connect('mqtt://broker.hivemq.com:1883', options);

    this.client.on('connect', () => {
      this.logger.log('MQTT connected');
      this.client.publish('app/status', 'online', { qos: 0, retain: false });

      this.client.subscribe(this.topics, { qos: 0 }, (err, granted) => {
        if (err) {
          this.logger.error(`Subscribe error: ${err.message}`);
        } else {
          this.logger.log(
            `Subscribed: ${(granted ?? []).map((g) => `${g.topic}@QoS${g.qos}`).join(', ')}`,
          );
        }
      });
    });

    this.client.on('reconnect', () => this.logger.warn('MQTT reconnecting...'));
    this.client.on('close', () => this.logger.warn('MQTT connection closed'));
    this.client.on('error', (err) =>
      this.logger.error(`MQTT error: ${err.message}`),
    );

    this.client.on('message', async (topic, message) => {
      try {
        const text = message.toString('utf8').trim();
        const data = JSON.parse(text);

        const gardenId = Number(
          data.gardenId ?? data.garderID ?? data.gardenID,
        );
        const recordedAt = data.recordedAt
          ? new Date(data.recordedAt)
          : new Date();

        if (topic === 'temperature' || topic === 'humidity') {
          const value = Number(data.value);
          if (!gardenId || Number.isNaN(value)) {
            this.logger.warn(`Invalid sensor payload on ${topic}: ${text}`);
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
          const led_dto = {
            gardenId,
            recordedAt: new Date().toISOString(),
            led1State: data.led1State,
            led2State: data.led2State,
            led3State: data.led3State,
          };

          this.wsGateway.emitSensorUpdate({
            topic,
            value: led_dto,
          });
          return;
        }
      } catch (e: any) {
        this.logger.error(
          `Failed to process message on ${topic}: ${e?.message || e}`,
        );
      }
    });
  }

  async publish(
    topic: string,
    payload: unknown,
    qos: 0 | 1 | 2 = 0,
    retain = false,
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!this.client) {
        return reject(new Error('MQTT client not initialized'));
      }
      const message =
        typeof payload === 'string' || Buffer.isBuffer(payload)
          ? (payload as string | Buffer)
          : JSON.stringify(payload);

      this.client.publish(topic, message, { qos, retain }, (err?: Error) => {
        if (err) {
          this.logger.error(`Publish error to "${topic}": ${err.message}`);
          return reject(err);
        }
        this.logger.log(
          `Published to "${topic}" (qos=${qos}, retain=${retain})`,
        );
        resolve();
      });
    });
  }

  onApplicationShutdown() {
    if (this.client?.connected) {
      this.client.end(true, () => this.logger.log('MQTT disconnected'));
    }
  }
}
