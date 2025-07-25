import { Injectable } from '@nestjs/common';
import { TenantRepository } from '../infrastructure/tenant.repository';
import { Tenant } from '../domain/tenant.entity';

@Injectable()
export class TenantService {
    constructor(private readonly tenantRepo: TenantRepository) {}

    async registerTenant(name: string) {
        return this.tenantRepo.createTenant(name);
    }
    
    async resolveTenant(tenantId: string) {
        return this.tenantRepo.findById(tenantId);
    }

    async setSearchPath(schema: string) {
        await this.tenantRepo.setSchema(schema);
    }

    // async rollbackCreation(schema: string, tenant: Tenant | null) {
    //     await this.tenantRepo.rollbackTenantCreation(schema, tenant);
    // }
}
