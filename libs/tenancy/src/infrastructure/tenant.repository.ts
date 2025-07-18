import { ConflictException, Inject, Injectable, InternalServerErrorException, LoggerService } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { publicDataOptions } from '@erp-system/shared-database';
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
        const existing = await this.dataSource.getRepository(Tenant).findOne({ where: { schema } });

        if (existing) {
            this.logger.warn(`Tenant with "${schema} exists.."`);
            throw new ConflictException('Tenant already exist..');
        }

        // Utilize query runner to create new tenant
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "${schema}"`);
            const tenant = queryRunner.manager.create(Tenant, { name, schema });
            await queryRunner.manager.save(tenant);
            await queryRunner.commitTransaction();
            await queryRunner.release()
            
            const newDataSource = new DataSource({
                ...publicDataOptions,
                name: `${schema}-dts`,
                schema
            });

            await newDataSource.initialize();
            await newDataSource.runMigrations();

            this.logger.log(`New tenant "${schema}" has been created..`);
            return tenant;

        } catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`There was error creating tenant schema.\n${error}`);
            throw new InternalServerErrorException('Error creating tenant..');
        }
    }
}
