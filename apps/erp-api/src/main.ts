import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const logger = new Logger('Bootstrap');
    const config = app.get(ConfigService);
    const port = config.get('PORT') as number;
    const globalPrefix = config.get('GLOBAL_PREFIX') as string;
    app.setGlobalPrefix(globalPrefix);
    await app.listen(port);
    logger.log(`Application is running on ":${port}/${globalPrefix}"`);
}

bootstrap();
