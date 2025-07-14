import { Test } from '@nestjs/testing';
import { SharedLoggerModule } from './shared-logger.module';
import { LoggerToken } from './logger.tokens';
import { ConfigModule } from '@nestjs/config';
import { CustomLoggerService } from './ports/custom-logger.service';

describe('SharedLoggerModule', () => {
    it('should provide NestLogger by default', async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ isGlobal: true, load: [() => ({})] }),
                SharedLoggerModule.forRoot(),
            ],
        }).compile();

        const logger = moduleRef.get<CustomLoggerService>(LoggerToken);
        expect(logger).toBeDefined();
        expect(typeof logger.log).toBe('function');
    });
});
