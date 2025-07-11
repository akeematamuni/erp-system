import { winstonOptions } from './logger.config';
import * as winston from 'winston';

describe('winstonOptions', () => {
    it('should return JSON format when format is json', () => {
        const options = winstonOptions({ format: 'json', output: undefined }, 'CTX');
        expect(options.format).toBeDefined();
        expect((options.transports as winston.transport[]).length).toBe(1);
    });

    it('should include file transport if output is file', () => {
        const options = winstonOptions({ format: undefined, output: 'file' }, 'CTX');
        expect((options.transports as winston.transport[]).length).toBe(1);
    });

    it('should include both transports if output is both', () => {
        const options = winstonOptions({ format: 'json', output: 'both' }, 'CTX');
        expect((options.transports as winston.transport[]).length).toBe(2);
    });
});
