import { Tenant } from './tenant.entity';
import { PublicUser } from './public-user.entity';
import { DataSource } from 'typeorm';

export interface ITenantRepository {
    setSchema(schema: string): Promise<any>;
    findById(id: string): Promise<Tenant|null>;
    createTenant(name: string): Promise<{ 
        tenant: Tenant; tenantDataSource: DataSource, dataSource: DataSource
    }>;
    createTenantUser(
        fullName: string, email: string, password: string, tenantId: string
    ): Promise<PublicUser>;
}
