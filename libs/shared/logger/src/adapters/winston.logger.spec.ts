import { WinstonLogger } from './winston.logger';
import * as winston from 'winston';

// Mock winston
jest.mock('winston', () => {
    const actualWinston = jest.requireActual('winston');
    return {
        ...actualWinston,
        createLogger: jest.fn(),
    };
});

// Test suite
describe('WinstonLogger', () => {
    let logger: WinstonLogger;
    let mockLogger: any;

    beforeEach(() => {
        mockLogger = {
            info: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
            verbose: jest.fn(),
            error: jest.fn(),
        };
        // @ts-ignore - override type for test
        winston.createLogger = jest.fn().mockReturnValue(mockLogger);
        logger = new WinstonLogger('WinstonLoggerContext');
    });

    it('should call log()', () => {
        logger.log('log message');
        expect(mockLogger.info).toHaveBeenCalledWith('log message');
    });

    it('should call warn()', () => {
        logger.warn('warn message');
        expect(mockLogger.warn).toHaveBeenCalledWith('warn message');
    });

    it('should call debug()', () => {
        logger.debug('debug message');
        expect(mockLogger.debug).toHaveBeenCalledWith('debug message');
    });

    it('should call verbose()', () => {
        logger.verbose('verbose message');
        expect(mockLogger.verbose).toHaveBeenCalledWith('verbose message');
    });

    it('should call error()', () => {
        logger.error('error message', 'trace');
        expect(mockLogger.error).toHaveBeenCalledWith('error message\ntrace');
    });

    it('should return a new instance with new context', () => {
        const newLogger = logger.addContext('NewWinstonLoggerContext');
        expect(newLogger).toBeInstanceOf(WinstonLogger);
    });
});
