import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Tenant } from '../domain/tenant.entity';
import { PublicUser } from '../domain/public-user.entity';
import { ITenantRepository } from '../domain/tenant.repository.interface';
import { LoggerToken, CustomLoggerService } from '@erp-system/shared-logger';
import { createNewTenant } from './data-access/create-tenant';
import { createNewUser } from './data-access/create-public-user';
import { IPublicUserRepository } from '../domain/public-user.repository.interface';

// cont step 5. Tenant Repository (Infrastructure Layer)
// Added PublicUser Repository 
@Injectable()
export class CentralRepository implements ITenantRepository, IPublicUserRepository {
    private readonly logger: LoggerService;
    private readonly tenantRepo: Repository<Tenant>;
    private readonly publicUserRepo: Repository<PublicUser>;

    constructor(
        private readonly dataSource: DataSource,
        @Inject(LoggerToken) base: CustomLoggerService
    ) {
        this.logger = base.addContext(CentralRepository.name);
        this.tenantRepo = dataSource.getRepository(Tenant);
        this.publicUserRepo = dataSource.getRepository(PublicUser);
    }

    private generateSchemaName(name: string) {
        return `tenant_${name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_')}`;
    }
    
    async findTenantById(id: string) {
        return this.tenantRepo.findOne({ where: { id } });
    }

    // Centralized users and tenant
    async createTenant(name: string) {
        const schema = this.generateSchemaName(name);
        return await createNewTenant(name, schema, this.logger, this.dataSource);
    }

    async createPublicUser(fullname: string, email: string, password: string, tenantId: string) {
        return await createNewUser(
            fullname, email, password, tenantId, this.logger, this.dataSource
        );
    }

    async findPublicUserById(id: string) {
        return await this.publicUserRepo.findOne({ 
            where: { id },
            relations: ['tenant']
        });
    };

    async findPublicUserByEmail(email: string) {
        return await this.publicUserRepo.findOne({
            where: { email },
            relations: ['tenant']
        });
    };

    // Set the search path of a request
    async setSchema(schema: string) {
        return this.dataSource.query(`SET search_path TO ${schema}, public`);
    }
}
