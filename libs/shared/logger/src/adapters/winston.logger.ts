// **** Work on winston logger to match nest logger

import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import { winstonOptions } from '../configs/logger.config';
import { CustomLoggerService } from '../ports/custom-logger.service';

@Injectable()
export class WinstonLogger implements CustomLoggerService {
    private readonly logger: winston.Logger;

    constructor(
        private readonly context = 'ERP-System',
        private readonly config = new ConfigService()
    ) {
        const format = config.get<'json'>('LOGGER_FORMAT');
        const output = config.get<'file' | 'both'>('LOGGER_OUTPUT');

        // Winston logging method, equivalent to Nest Logger
        this.logger = winston.createLogger(
            winstonOptions({ format, output }, context)
        );
    }

    log(message: string) {
        this.logger.info(message);
    }

    warn(message: string) {
        this.logger.warn(message);
    }

    debug(message: string) {
        this.logger.debug(message);
    }

    verbose(message: string) {
        this.logger.verbose(message);
    }

    error(message: string, trace?: string) {
        this.logger.error(message + (trace ? `\n${trace}` : ''));
    }

    addContext(context: string): LoggerService {
        return new WinstonLogger(context);
    }
}
