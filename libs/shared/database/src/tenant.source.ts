import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { User } from '@erp-system/shared-auth';
import { parsed } from '@erp-system/shared-config';

// Tables to create inside each tenant schema
export const tenantDataOptions: PostgresConnectionOptions = {
    type: 'postgres',
    url: parsed.data?.DATABASE_URL,
    entities: [User],
    migrations: ['libs/shared/database/src/migrations/tenant/*.ts']
}

export default new DataSource(tenantDataOptions);
