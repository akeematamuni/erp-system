import { ConflictException, Inject, Injectable, InternalServerErrorException, LoggerService } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { tenantDataOptions } from '@erp-system/shared-database';
import { Tenant } from '../domain/tenant.entity';
import { ITenantRepository } from '../domain/tenant.repository.interface';
import { LoggerToken, CustomLoggerService } from '@erp-system/shared-logger';

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
    
    // 
    async findById(id: string) {
        return this.dataSource.getRepository(Tenant).findOne({ where: { id } });
    }
    // 
    async setSchema(schema: string) {
        return this.dataSource.query(`SET search_path TO ${schema}, public`);
    }

    // Tenant creation, rollback and more..
    private generateSchemaName(name: string) {
        return `tenant_${name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_')}`;
    }

    // 
    private async rollbackTenantCreation(schema: string, tenant: Tenant | null) {
        this.logger.warn(`Rolling back the failed tenant creation for ${schema}`);

        try {
            await this.dataSource.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
            this.logger.log(`Successfully dropped schema ${schema}`);

        } catch (error) {
            this.logger.warn(`Error dropping schema: ${schema}`);
        }

        if (tenant && tenant.id) {
            try {
                await this.dataSource.getRepository(Tenant).delete(tenant.id);
                this.logger.log(`Tenant entry "${tenant.id}" deleted from public.tenants.`);
            } catch (error) {
                this.logger.error(`Failed to delete tenant entry "${tenant.id}"\n${error}`);
            }
        } else {
            this.logger.warn(`No tenant entry to delete for "${schema}" on public.tenant`);
        }

        this.logger.log(`${schema} rollback completed successfully..`);
    }

    // 
    async createTenant(name: string) {
        const schema = this.generateSchemaName(name);
        const queryRunner = this.dataSource.createQueryRunner();
        let tenantDataSource: DataSource | undefined;
        let tenant: Tenant |  null = null;

        const existing = await this.dataSource.getRepository(Tenant).findOne(
            { where: { schema } }
        );

        if (existing) {
            this.logger.warn(`Tenant with "${schema} exists.."`);
            throw new ConflictException('Tenant already exist..');
        }

        this.logger.log(`Schema name generated: ${schema}`);

        // Create tenant schema and save record to public
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
            await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "${schema}"`);

            tenant = queryRunner.manager.create(Tenant, { name, schema });

            await queryRunner.manager.save(tenant);
            await queryRunner.commitTransaction();
            this.logger.log(`New tenant "${schema}" has been created..`);

        } catch (error) {
            // Rollback transaction if error occurs
            if (queryRunner.isTransactionActive) {
                await queryRunner.rollbackTransaction();
                this.logger.warn(`Transaction for schema "${schema}" rolled back..`);
            }

            this.logger.error(`Error during initial ${schema} check/creation..\n${error}`);
            throw new InternalServerErrorException('Error during tenant creation..');

        } finally {
            if (!queryRunner.isReleased) {
                await queryRunner.release();
            }
        }

        // Run migrations on the new schema
        tenantDataSource = new DataSource({
            ...tenantDataOptions,
            name: `${schema}-dts`,
            schema
        });
            
        try {
            await tenantDataSource.initialize();
            await tenantDataSource.runMigrations();

            this.logger.log(`Successfully ran migrations for tenant: ${schema}`);
            return { tenant, tenantDataSource };
        
        } catch (error) {
            this.logger.error(`Error running migrations on schema: ${schema}\n${error}`);

            // Specifically cleanup partials
            await this.rollbackTenantCreation(schema, tenant);
            throw new InternalServerErrorException('Error running migrations..');

        } finally {
            if (tenantDataSource && tenantDataSource.isInitialized) {
                await tenantDataSource.destroy();
            }
        }
    }
}
