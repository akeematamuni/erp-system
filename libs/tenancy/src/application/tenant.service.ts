import { Injectable } from '@nestjs/common';
import { CentralRepository } from '../infrastructure/tenant.repository';

@Injectable()
export class TenantService {
    constructor(private readonly tenantRepo: CentralRepository) {}

    async registerTenant(name: string) {
        return this.tenantRepo.createTenant(name);
    }
    
    async resolveTenant(tenantId: string) {
        return this.tenantRepo.findTenantById(tenantId);
    }

    async registerPublicUser(fullname: string, email: string, password: string, tenantId: string) {
        return await this.tenantRepo.createPublicUser(
            fullname, email, password, tenantId
        );
    }

    async resolvePublicUserId(userId: string) {
        return await this.tenantRepo.findPublicUserById(userId);
    }

    async resolvePublicUserEmail(email: string) {
        return await this.tenantRepo.findPublicUserByEmail(email);
    }

    async setSearchPath(schema: string) {
        await this.tenantRepo.setSchema(schema);
    }
}
