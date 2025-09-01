import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { Tenant, PublicUser } from '@erp-system/tenancy';
import { parsed } from '@erp-system/shared-config';

// Connect to database and create tenant and user table in public
export const publicDataOptions: PostgresConnectionOptions = {
    type: 'postgres',
    url: parsed.data?.DATABASE_URL,
    entities: [Tenant, PublicUser],
    migrations: ['libs/shared/database/src/migrations/public/*.ts'],
    // ssl: { rejectUnauthorized: false }
}

export const PublicDataSource = new DataSource(publicDataOptions);
