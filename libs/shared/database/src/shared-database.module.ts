import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErpSystemSharedConfigModule } from '@erp-system/shared-config';
import { Tenant, PublicUser } from '@erp-system/tenancy';
import { User } from '@erp-system/users';
import { 
    InvCategory, InvWarehouse, 
    InvMaterial, InvStock, InvStockMovement 
} from '@erp-system/inventory';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ErpSystemSharedConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                type: 'postgres',
                url: config.get<string>('DATABASE_URL'),
                // ssl: { rejectUnauthorized: false },
                entities: [
                    Tenant, PublicUser, User,
                    InvCategory, InvWarehouse,
                    InvMaterial, InvStock,
                    InvStockMovement
                ],
                synchronize: false,
            })
        }),
    ],
    exports: [],
})
export class SharedDatabaseModule {}
