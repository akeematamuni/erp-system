import { NestLogger } from './nest.logger';
import { Logger } from '@nestjs/common';

describe('NestLogger', () => {
    let logger: NestLogger;

    beforeEach(() => {
        logger = new NestLogger('NestLoggerContext');
    });

    it('should call log()', () => {
        const log = jest.spyOn(Logger.prototype, 'log').mockImplementation();
        logger.log('test log');
        expect(log).toHaveBeenCalledWith('test log');
    });

    it('should call warn()', () => {
        const warn = jest.spyOn(Logger.prototype, 'warn').mockImplementation();
        logger.warn('test warn');
        expect(warn).toHaveBeenCalledWith('test warn');
    });

    it('should call debug()', () => {
        const debug = jest.spyOn(Logger.prototype, 'debug').mockImplementation();
        logger.debug('test debug');
        expect(debug).toHaveBeenCalledWith('test debug');
    });

    it('should call verbose()', () => {
        const verbose = jest.spyOn(Logger.prototype, 'verbose').mockImplementation();
        logger.verbose('test verbose');
        expect(verbose).toHaveBeenCalledWith('test verbose');
    });

    it('should call error()', () => {
        const error = jest.spyOn(Logger.prototype, 'error').mockImplementation();
        logger.error('test error', 'trace info');
        expect(error).toHaveBeenCalledWith('test error\ntrace info');
    });

    it('should add new context via addContext()', () => {
        const newLogger = logger.addContext('NewNestLoggerContext');
        expect(newLogger).toBeInstanceOf(NestLogger);
    });
});
