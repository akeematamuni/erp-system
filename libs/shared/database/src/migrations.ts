import { DataSource } from 'typeorm';
import { PublicDataSource as pd } from './public.source';
import { tenantDataOptions } from './tenant.source';

async function runMigrations() {
    console.log('Starting migration script for tenants...');

    try {
        await pd.initialize();
        const queryRunner = pd.createQueryRunner();

        const result = await queryRunner.query(
            `SELECT schema_name FROM information_schema.schemata WHERE schema_name LIKE 'tenant_%';`
        );
        
        await queryRunner.release();

        let tenantSchemas = result.map((row: { schema_name: string }) => row.schema_name);
        tenantSchemas.sort();

        if (tenantSchemas.length >= 1) {
            console.log(
                `Found ${tenantSchemas.length} tenant schemas\nFirst tenant: ${tenantSchemas[0]}`
            );
            
        } else {
            console.log('No tenant schemas found..');
            return;
        }

        for (const schema of tenantSchemas) {
            const tenantDataSource = new DataSource({
                ...tenantDataOptions,
                schema,
            });

            await tenantDataSource.initialize();
            await tenantDataSource.runMigrations();
            await tenantDataSource.destroy();
        }

        console.log('Migration script for all tenants finished successfully...');

    } catch (error) {
        console.error(`Error occurred during the migration\n${error}`);
        process.exit(1);

    } finally {
        if (pd && pd.isInitialized) {
            await pd.destroy();
        }
    }
}

runMigrations();
