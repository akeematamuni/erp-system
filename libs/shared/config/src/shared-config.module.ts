import { Module, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from './config/config.schema.js';
import * as dotenv from 'dotenv';

dotenv.config();
const parsed = configSchema.safeParse(process.env);

const logger = new Logger('SharedConfig');
if (!parsed.success) {
    logger.error('Error parsing env variables: ', parsed.error.format());
    process.exit(1);
}

@Module({
    imports: [ConfigModule.forRoot({
        isGlobal: true, load: [() => parsed.data]
    })],
    exports: [],
})
export class ErpSystemSharedConfigModule {}
