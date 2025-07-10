import { Logger, LoggerService } from '@nestjs/common';
import { CustomLoggerService } from '../ports/custom-logger.service';

// Adapting nest logger to be used in a custom way
export class NestLogger implements CustomLoggerService {
    private readonly logger: Logger;

    constructor(private readonly context = 'ERP-System') {
        this.logger = new Logger(context);
    }

    log(message: string) {
        this.logger.log(message);
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
        // this.logger.error(message, trace);
        this.logger.error(message + (trace ? `\n${trace}` : ''));
    }

    addContext(context: string): LoggerService {
        return new NestLogger(context);
    }
}
