import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { Tenant } from '@erp-system/tenancy';
import { parsed } from '@erp-system/shared-config';

// Connect to database and create tenant table in public
export const publicDataOptions: PostgresConnectionOptions = {
    type: 'postgres',
    url: parsed.data?.DATABASE_URL,
    entities: [Tenant],
    migrations: ['libs/shared/database/src/migrations/public/*.ts']
}

export default new DataSource(publicDataOptions);
