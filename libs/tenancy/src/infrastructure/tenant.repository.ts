import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Tenant } from '../domain/tenant.entity';
import { ITenantRepository } from '../domain/tenant.repository.interface';
import { LoggerToken, CustomLoggerService } from '@erp-system/shared-logger';
import { createNewTenant } from './data-access/create-tenant';
import { createNewUser } from './data-access/create-public-user';

// cont step 5. Tenant Repository (Infrastructure Layer)
@Injectable()
export class TenantRepository implements ITenantRepository {
    private readonly logger: LoggerService;

    constructor(
        private readonly dataSource: DataSource,
        @Inject(LoggerToken) base: CustomLoggerService
    ) {
        this.logger = base.addContext(TenantRepository.name);
    }

    private generateSchemaName(name: string) {
        return `tenant_${name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_')}`;
    }
    
    async findById(id: string) {
        return this.dataSource.getRepository(Tenant).findOne({ where: { id } });
    }

    async setSchema(schema: string) {
        return this.dataSource.query(`SET search_path TO ${schema}, public`);
    }

    // Tenant creation, rollback and more...
    async createTenant(name: string) {
        const schema = this.generateSchemaName(name);
        return await createNewTenant(name, schema, this.logger, this.dataSource);
    }

    async createTenantUser(fullname: string, email: string, password: string, tenantId: string) {
        return await createNewUser(
            fullname, email, password, tenantId, this.logger, this.dataSource
        );
    }
}
