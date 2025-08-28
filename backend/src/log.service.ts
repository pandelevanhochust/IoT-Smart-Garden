import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggingService {
  private readonly logFilePath = path.join(__dirname, 'user-activity.txt');
  logUserActivity(message: string): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;

    fs.appendFile(this.logFilePath, logMessage, (err) => {
      if (err) {
        console.error('Failed to write log:', err);
      }
    });
  }
}
