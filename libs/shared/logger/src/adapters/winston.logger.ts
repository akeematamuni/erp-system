// **** Work on winston logger to match nest logger


// import { Injectable, LoggerService } from '@nestjs/common';
// import * as winston from 'winston';

// @Injectable()
// export class WinstonLogger implements LoggerService {
//     private logger = winston.createLogger({
//         level: 'debug',
//         format: winston.format.combine(
//             winston.format.timestamp(),
//             winston.format.printf(({ level, message, timestamp }) => {
//                 return `[${timestamp}] ${level}: ${message}`;
//             })
//         ),
//         transports: [new winston.transports.Console()],
//     });

//     log(message: string) {
//         this.logger.info(message);
//     }

//     warn(message: string) {
//         this.logger.warn(message);
//     }

//     debug(message: string) {
//         this.logger.debug(message);
//     }

//     error(message: string, trace?: string) {
//         this.logger.error(message + (trace ? `\n${trace}` : ''));
//     }
// }
