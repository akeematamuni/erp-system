import { Injectable } from '@nestjs/common';
import { TenantRepository } from '../infrastructure/tenant.repository';

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
}
