import { join } from 'path';
import * as fs from 'fs-extra';
import * as winston from 'winston';

interface WinstonOptions {
    format: 'json' | undefined;
    output: 'file' | 'both' | undefined;
}

export function winstonOptions(options: WinstonOptions, ctx: string): winston.LoggerOptions {
    const formats = [];

    // Timestamp first and always
    formats.push(winston.format.timestamp());

    // How to format logs
    if (options.format === 'json') {
        formats.push(winston.format.json());
    } else {
        formats.push(winston.format.printf(({ level, message, timestamp }) => {
            return `[${timestamp}] ${level.toUpperCase()}: [${ctx}] ${message}`;
        }));
    }

    // Transport/Logs destination
    const transports: winston.transport[] = [];
    const filename = join(process.cwd(), 'logs/erp.log');
    fs.ensureFileSync(filename);

    if (options.output === 'both') {
        transports.push(
            new winston.transports.Console(),
            new winston.transports.File({ filename })
        );
    } else if (options.output === 'file') {
        transports.push(new winston.transports.File({ filename }));
    } else {
        transports.push(new winston.transports.Console());
    }

    return {
        level: 'debug',
        format: winston.format.combine(...formats),
        transports
    };
}

