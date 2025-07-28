import { Injectable } from '@nestjs/common';
import { TenantRepository } from '../infrastructure/tenant.repository';
import { PublicUser } from '../domain/public-user.entity';

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

    async addNewUser(fullname: string, email: string, password: string, tenantId: string) {
        return await this.tenantRepo.createTenantUser(
            fullname, email, password, tenantId
        );
    }
}
