import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { User } from '@erp-system/shared-auth';
import { parsed } from '@erp-system/shared-config';
import { CreateUserTable1753715874894 } from './migrations/tenant/1753715874894-CreateUserTable';

// Tables to create inside each tenant schema
export const tenantDataOptions: PostgresConnectionOptions = {
    type: 'postgres',
    url: parsed.data?.DATABASE_URL,
    entities: [User],
    migrations: [CreateUserTable1753715874894],
    ssl: { rejectUnauthorized: false }
}

export const defaultSchema = 'a_default_schema';

export const TenantDataSource = new DataSource({
    ...tenantDataOptions,
    schema: defaultSchema
});
