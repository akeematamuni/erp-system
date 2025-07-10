import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { LoggerToken, CustomLoggerService } from '@erp-system/shared-logger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const config = app.get<ConfigService>(ConfigService);
    const baseLogger = app.get<CustomLoggerService>(LoggerToken);
    const logger = baseLogger.addContext('Bootstrap');
    const port = config.get('PORT') as number;
    const globalPrefix = config.get('GLOBAL_PREFIX') as string;
    app.setGlobalPrefix(globalPrefix);
    await app.listen(port);
    logger.log(`Application is running on ":${port}/${globalPrefix}"`);
}

bootstrap();
