import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErpSystemSharedConfigModule } from '@erp-system/shared-config';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ErpSystemSharedConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                type: 'postgres',
                url: config.get<string>('DATABASE_URL'),
                autoLoadEntities: true,
                synchronize: true // Remove for prod
            })
        }),
    ],
    exports: [],
})
export class SharedDatabaseModule {}
