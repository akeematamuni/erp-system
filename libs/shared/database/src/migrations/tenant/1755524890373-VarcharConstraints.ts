import { MigrationInterface, QueryRunner } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export class VarcharConstraints1755524890373 implements MigrationInterface {
    name = 'VarcharConstraints1755524890373';

    public async up(queryRunner: QueryRunner): Promise<void> {
        const options = queryRunner.connection.options as PostgresConnectionOptions;
        const currentSchema = options.schema;
        
        if (!currentSchema) throw new Error('Tenant schema is not defined...');

        await queryRunner.query(`
            ALTER TABLE "${currentSchema}"."inv_stock_movements"
            ALTER COLUMN "reason" TYPE varchar(128),
            ALTER COLUMN "reference" TYPE varchar(24)
        `);
        await queryRunner.query(`
            ALTER TABLE "${currentSchema}"."inv_warehouses"
            ALTER COLUMN "code" TYPE varchar(12),
            ALTER COLUMN "code" SET NOT NULL,
            ALTER COLUMN "name" TYPE varchar(16),
            ALTER COLUMN "name" SET NOT NULL,
            ALTER COLUMN "address" TYPE varchar(128)
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX IF NOT EXISTS "IDX_d517cd224ac016722bd047bac3"
            ON "${currentSchema}"."inv_warehouses" ("code")
        `);
        await queryRunner.query(`
            ALTER TABLE "${currentSchema}"."inv_materials"
            ALTER COLUMN "sku" TYPE varchar(16),
            ALTER COLUMN "sku" SET NOT NULL,
            ALTER COLUMN "name" TYPE varchar(16),
            ALTER COLUMN "name" SET NOT NULL,
            ALTER COLUMN "uom" TYPE varchar(16),
            ALTER COLUMN "uom" SET NOT NULL
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX IF NOT EXISTS "IDX_6bef7b58ad59182ceef75fa7d3"
            ON "${currentSchema}"."inv_materials" ("sku")
        `);
        await queryRunner.query(`
            ALTER TABLE "${currentSchema}"."inv_categories"
            ALTER COLUMN "name" TYPE varchar(64),
            ALTER COLUMN "name" SET NOT NULL,
            ALTER COLUMN "description" TYPE varchar(255)
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX IF NOT EXISTS "IDX_387f349805185e85011f5b7f8e"
            ON "${currentSchema}"."inv_categories" ("name")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const options = queryRunner.connection.options as PostgresConnectionOptions;
        const currentSchema = options.schema;

        if (!currentSchema) throw new Error('Tenant schema is not defined...');

        await queryRunner.query(`
            ALTER TABLE "${currentSchema}"."inv_stock_movements"
            ALTER COLUMN "reason" TYPE varchar,
            ALTER COLUMN "reference" TYPE varchar
        `);
        await queryRunner.query(`
            ALTER TABLE "${currentSchema}"."inv_warehouses"
            ALTER COLUMN "code" TYPE varchar,
            ALTER COLUMN "name" TYPE varchar,
            ALTER COLUMN "address" TYPE varchar
        `);
        await queryRunner.query(`
            ALTER TABLE "${currentSchema}"."inv_materials"
            ALTER COLUMN "sku" TYPE varchar,
            ALTER COLUMN "name" TYPE varchar,
            ALTER COLUMN "uom" TYPE varchar
        `);
        await queryRunner.query(`
            ALTER TABLE "${currentSchema}"."inv_categories"
            ALTER COLUMN "name" TYPE varchar,
            ALTER COLUMN "description" TYPE varchar
        `);
        await queryRunner.query(`DROP INDEX IF EXISTS "${currentSchema}"."IDX_d517cd224ac016722bd047bac3"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "${currentSchema}"."IDX_6bef7b58ad59182ceef75fa7d3"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "${currentSchema}"."IDX_387f349805185e85011f5b7f8e"`);
    }
}
