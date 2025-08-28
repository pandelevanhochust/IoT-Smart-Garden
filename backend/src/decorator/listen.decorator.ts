import { Logger, SetMetadata, ExecutionContext } from '@nestjs/common';
import { Param, ParseIntPipe } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserController } from './../user/user.controller';
import { UserService } from './../user/user.service';
import { PrismaService } from 'prisma/prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggingService } from './../utils/log.service';

export const LISTEN_KEY = 'isListen';
export const Listen = (): MethodDecorator => {
  const logToFile = (
    username: string,
    duration: number,
    logger: LoggingService,
  ) => {
    const message = `User ${username} passed in ${duration}ms`;
    logger.logUserActivity(message);
  };

  return (
    target: any,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      console.log(originalMethod);
      const start = Date.now();
      const result = await originalMethod.apply(this, args);
      const end = Date.now();
      console.log(this);
      console.log('target: \n', target); // the class
      console.log('key: \n', key); // the actuator, method at endpoint
      console.log('descriptor: \n', descriptor.value);
      console.log(`User ${result.username} passed in ${end - start}ms`);
      logToFile(result.username, end - start, this.loggingService);
      return result;
    };

    return descriptor;
  };
};
