import { LoggerService } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Tenant } from '../../domain/tenant.entity';

export async function rollbackTenantCreation(
    schema: string, 
    tenant: Tenant | null,
    logger: LoggerService,
    dataSource: DataSource
) {
    logger.warn(`Rolling back the failed tenant creation for "${schema}"`);

    try {
        await dataSource.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);

    } catch (error) {
        logger.error(`Error dropping "${schema}"`);
    }

    if (tenant && tenant.id) {
        try {
            await dataSource.getRepository(Tenant).delete(tenant.id);  
        } catch (error) {
            logger.error(`Failed to delete tenant entry "${tenant.id}"\n${error}`);
        }
    } else {
        logger.warn(`No tenant entry to delete for "${schema}" on public.tenant`);
    }

    logger.log(`"${schema}" rollback completed successfully..`);
}
