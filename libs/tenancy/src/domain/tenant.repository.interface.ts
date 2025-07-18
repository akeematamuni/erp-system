import { Tenant } from './tenant.entity';

export interface ITenantRepository {
    setSchema(schema: string): Promise<any>;
    findById(id: string): Promise<Tenant|null>;
    createTenant(name: string): Promise<Tenant>;
}
