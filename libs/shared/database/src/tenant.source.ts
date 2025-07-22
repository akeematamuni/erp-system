import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { User } from '@erp-system/shared-auth';
import { parsed } from '@erp-system/shared-config';
import { CreateUserTable1753118629025 } from './migrations/tenant/1753118629025-CreateUserTable';

// Tables to create inside each tenant schema
export const tenantDataOptions: PostgresConnectionOptions = {
    type: 'postgres',
    url: parsed.data?.DATABASE_URL,
    entities: [User],
    migrations: [CreateUserTable1753118629025],
    ssl: { rejectUnauthorized: false }
}

export default new DataSource({
    ...tenantDataOptions,
    migrations: ['libs/shared/database/src/migrations/tenant/*.ts']
});
