import { ConflictException, InternalServerErrorException, LoggerService } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Tenant } from '../../domain/tenant.entity';
import { tenantDataOptions } from '@erp-system/shared-database';
import { rollbackTenantCreation } from './rollback-tenant';

// Create new tenant and rollback if error occurs
export async function createNewTenant(
    name: string,
    schema: string,
    logger: LoggerService,
    dataSource: DataSource
) {
    let tenant: Tenant |  null = null;
    let tenantDataSource: DataSource | undefined;

    const existing = await dataSource.getRepository(Tenant).findOne(
        { where: { schema } }
    );

    if (existing) {
        logger.warn(`Tenant with "${schema}" exists..`);
        throw new ConflictException('Tenant already exist..');
    }

    logger.log(`Schema name generated: "${schema}"`);

    // Create tenant schema and save record to public
    const queryRunner = dataSource.createQueryRunner();
    try {
        await queryRunner.connect();
        await queryRunner.startTransaction();
        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "${schema}"`);

        tenant = queryRunner.manager.create(Tenant, { name, schema });

        await queryRunner.manager.save(tenant);
        await queryRunner.commitTransaction();
        logger.log(`New tenant "${schema}" has been created..`);

    } catch (error) {
        // Rollback transaction if error occurs
        if (queryRunner.isTransactionActive) {
            await queryRunner.rollbackTransaction();
        }

        logger.error(`Error during initial "${schema}" check/creation..\n${error}`);
        throw new InternalServerErrorException(
            'Error occured during registration, please try later...'
        );

    } finally {
        if (!queryRunner.isReleased) await queryRunner.release();
    }

    // Run migrations on the new schema
    tenantDataSource = new DataSource({
        ...tenantDataOptions,
        schema
    });
    
    try {
        await tenantDataSource.initialize();
        await tenantDataSource.runMigrations();

        logger.log(`Successfully ran migrations for "${schema}"`);
        return { tenant, dataSource };
    
    } catch (error) {
        await rollbackTenantCreation(schema, tenant, logger, dataSource);

        throw new InternalServerErrorException(
            'Error occured during registration, please try later...'
        );

    } finally {
        if (tenantDataSource && tenantDataSource.isInitialized) {
            await tenantDataSource.destroy();
        }
    }
}
