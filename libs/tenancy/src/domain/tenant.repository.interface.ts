import { Tenant } from './tenant.entity';
import { DataSource } from 'typeorm';

export interface ITenantRepository {
    setSchema(schema: string): Promise<any>;
    findById(id: string): Promise<Tenant|null>;
    // rollbackTenantCreation(schema: string, tenant: Tenant | null): Promise<void>;
    createTenant(name: string): Promise<{ 
        tenant: Tenant; tenantDataSource: DataSource, dataSource: DataSource
    }>;
}
