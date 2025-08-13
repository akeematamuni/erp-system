import { DataSource } from 'typeorm';
import { publicDataOptions } from './public.source';
import { tenantDataOptions } from './tenant.source';

export async function runMigrations() {
    console.log('Starting migration script for tenants...');

    const publicDataSource = new DataSource(publicDataOptions)
    await publicDataSource.initialize();
    const queryRunner = publicDataSource.createQueryRunner();
    await queryRunner.connect();

    try {
        const result = await queryRunner.query(
            `SELECT schema_name FROM information_schema.schemata WHERE schema_name LIKE 'tenant_%';`
        );
        
        await queryRunner.release();

        // console.log(`First result: ${result[0]}`);
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
        if (publicDataSource && publicDataSource.isInitialized) {
            await publicDataSource.destroy();
        }
    }
}

runMigrations();
