import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TenantRepository } from '../infrastructure/tenant.repository';

@Injectable()
export class TenantService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly tenantRepo: TenantRepository
    ){}

    async resolveTenant(tenantId: string) {
        return this.tenantRepo.findById(tenantId);
    }

    async setSearchPath(schema: string) {
        await this.dataSource.query(`SET search_path TO ${schema}, public`)
    }
}
