import { Module, DynamicModule, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ErpSystemSharedConfigModule } from '@erp-system/shared-config';
import { LoggerToken } from './logger.tokens';
import { NestLogger } from './adapters/nest.logger';
import { ContextualLoggerService } from './ports/contextual-logger.service';

// Dynamically inject the appropriate logging mechanism
@Module({})
export class SharedLoggerModule {
    static forRoot(): DynamicModule {
        const loggerProvider: Provider = {
            provide: LoggerToken,
            inject: [ConfigService],
            useFactory: (config: ConfigService): ContextualLoggerService => {
                const loggerType = config.get('LOGGER_TYPE') as string;

                switch (loggerType) {
                    case 'nest':
                    default:
                        return new NestLogger();
                }
            }
        };
        return {
            global: true,
            module: SharedLoggerModule,
            imports: [ErpSystemSharedConfigModule],
            providers: [loggerProvider],
            exports: [loggerProvider]
        };
    }
}
