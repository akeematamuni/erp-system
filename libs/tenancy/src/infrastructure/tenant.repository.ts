import { ConflictException, Inject, Injectable, InternalServerErrorException, LoggerService } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { tenantDataOptions } from '@erp-system/shared-database';
import { Tenant } from '../domain/tenant.entity';
import { ITenantRepository } from '../domain/tenant.repository.interface';
import { LoggerToken, CustomLoggerService } from '@erp-system/shared-logger';
// import { User } from '@erp-system/shared-auth';
// import { CreateUserTable1753118629025 } from '@erp-system/shared-database';

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

    async createTenant(name: string) {
        const schema = this.generateSchemaName(name);

        try {
            const existing = await this.dataSource
            .getRepository(Tenant)
            .findOne({ where: { schema } });

            if (existing) {
                this.logger.warn(`Tenant with "${schema} exists.."`);
                throw new ConflictException('Tenant already exist..');
            }
            this.logger.log(`Schema name generated: ${schema}`);

        } catch (error) {
            this.logger.error(`Error during initial tenant check:\n${error}`);
            if (error instanceof ConflictException) throw error;
            throw new InternalServerErrorException('Internal error during tenant check...');
        }

        // Utilize query runner to create new tenant
        let tenant: Tenant;
        const queryRunner = this.dataSource.createQueryRunner();
    
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
            await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "${schema}"`);

            tenant = queryRunner.manager.create(Tenant, { name, schema });

            await queryRunner.manager.save(tenant);
            await queryRunner.commitTransaction();
            await queryRunner.release()
            
            this.logger.log(`New tenant "${schema}" has been created..`);

        } catch (error) {
            if (queryRunner.isTransactionActive) {
                await queryRunner.rollbackTransaction();
                this.logger.warn(`Transaction for schema "${schema}" rolled back..`);
            }
            // Might have to delete already created schema******
            this.logger.error(`There was error creating tenant ${schema}.\n${error}`);
            throw new InternalServerErrorException('Error during tenant creation..');
        }

        try {
            const tenantDataSource = new DataSource({
                ...tenantDataOptions,
                name: `${schema}-dts`,
                schema
            });
            
            await tenantDataSource.initialize();
            await tenantDataSource.runMigrations();

            this.logger.log(`Successfully ran migrations for tenant: ${schema}`);
            return { tenant, tenantDataSource };
        
        } catch (error) {
            this.logger.error(`Error running migrations on schema: ${schema}\n${error}`);
            throw new InternalServerErrorException('Error running migrations..');
        }
    }
}
