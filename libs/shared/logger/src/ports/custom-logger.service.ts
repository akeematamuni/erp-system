import { LoggerService } from '@nestjs/common';

// Create an interface that would allow LoggerService use context
export interface CustomLoggerService extends LoggerService {
    addContext(context: string): LoggerService;
}
