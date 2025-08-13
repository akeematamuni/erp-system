import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { User } from '@erp-system/users';
import { parsed } from '@erp-system/shared-config';
import { CreateUserTable1753715874894 } from './migrations/tenant/1753715874894-CreateUserTable';
import { RenameUsersToTenantUsers1754941714938 } from './migrations/tenant/1754941714938-RenameUsersToTenantUsers';
import { ChangePrimaryColumn1755085659088 } from './migrations/tenant/1755085659088-ChangePrimaryColumn';

// Tables to create inside each tenant schema
export const tenantDataOptions: PostgresConnectionOptions = {
    type: 'postgres',
    url: parsed.data?.DATABASE_URL,
    entities: [User],
    migrations: [
        CreateUserTable1753715874894,
        RenameUsersToTenantUsers1754941714938,
        ChangePrimaryColumn1755085659088
    ],
    ssl: { rejectUnauthorized: false }
}

export const defaultSchema = 'tenant_001';

export const TenantDataSource = new DataSource({
    ...tenantDataOptions,
    schema: defaultSchema
});
