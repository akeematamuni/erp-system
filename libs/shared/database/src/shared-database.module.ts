import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErpSystemSharedConfigModule } from '@erp-system/shared-config';
import { Tenant } from '@erp-system/tenancy';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ErpSystemSharedConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                type: 'postgres',
                url: config.get<string>('DATABASE_URL'),
                ssl: { rejectUnauthorized: false },
                entities: [Tenant],
                synchronize: false,
            })
        }),
    ],
    exports: [],
})
export class SharedDatabaseModule {}
