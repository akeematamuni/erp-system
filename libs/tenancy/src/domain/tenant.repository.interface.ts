import { Tenant } from './tenant.entity';

export interface ITenantRepository {
    findById(id: string): Promise<Tenant|null>;
}
