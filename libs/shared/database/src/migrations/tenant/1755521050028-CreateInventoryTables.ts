import { MigrationInterface, QueryRunner } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export class CreateInventoryTables1755521050028 implements MigrationInterface {
    name = 'CreateInventoryTables1755521050028'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const options = queryRunner.connection.options as PostgresConnectionOptions;
        const currentSchema = options.schema;

        if (!currentSchema) throw new Error('Tenant schema is not defined...');

        await queryRunner.query(`CREATE TYPE "${currentSchema}"."inv_stock_movements_movementtype_enum" AS ENUM('IN', 'OUT', 'TRANSFER')`);
        await queryRunner.query(`CREATE TABLE "${currentSchema}"."inv_stock_movements" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "movementType" "${currentSchema}"."inv_stock_movements_movementtype_enum" NOT NULL, "quantity" numeric(18,3) NOT NULL, "reason" character varying, "reference" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "materialId" uuid NOT NULL, "toWarehouseId" uuid, "fromWarehouseId" uuid, CONSTRAINT "PK_eddc6987777b1dd5d39341b8063" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ffb6d8c25bbcdec7dad619b5e9" ON "${currentSchema}"."inv_stock_movements" ("materialId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d02e55615cb0a2c79752d63096" ON "${currentSchema}"."inv_stock_movements" ("toWarehouseId") `);
        await queryRunner.query(`CREATE INDEX "IDX_b67c3ad8058c47b131e4e88a42" ON "${currentSchema}"."inv_stock_movements" ("fromWarehouseId") `);
        await queryRunner.query(`CREATE TABLE "${currentSchema}"."inv_warehouses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying NOT NULL, "name" character varying NOT NULL, "address" character varying, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cfbf2f077a1e264c36f7bc0d420" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_d517cd224ac016722bd047bac3" ON "${currentSchema}"."inv_warehouses" ("code") `);
        await queryRunner.query(`CREATE TABLE "${currentSchema}"."inv_stocks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" numeric(18,3) NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "materialId" uuid NOT NULL, "warehouseId" uuid NOT NULL, CONSTRAINT "UQ_01ad878b331c69613df9ed06917" UNIQUE ("materialId", "warehouseId"), CONSTRAINT "CHK_4cc379f7a7e637f493e32c660b" CHECK ("quantity" >= 0), CONSTRAINT "PK_b0713bcc4d9ffecf71a4fa5be3c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5ac7e59af881cb7008d7988ae2" ON "${currentSchema}"."inv_stocks" ("materialId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5c845f555849d51eb11739cea3" ON "${currentSchema}"."inv_stocks" ("warehouseId") `);
        await queryRunner.query(`CREATE TABLE "${currentSchema}"."inv_materials" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sku" character varying NOT NULL, "name" character varying NOT NULL, "uom" character varying NOT NULL DEFAULT 'EA', "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "categoryId" uuid NOT NULL, CONSTRAINT "PK_62b4a56271f20992faeb601934a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_6bef7b58ad59182ceef75fa7d3" ON "${currentSchema}"."inv_materials" ("sku") `);
        await queryRunner.query(`CREATE INDEX "IDX_c227da6c874e8b5bd2d687e77c" ON "${currentSchema}"."inv_materials" ("categoryId") `);
        await queryRunner.query(`CREATE TABLE "${currentSchema}"."inv_categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_69e71dad19fb0370ade1e4092ce" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_387f349805185e85011f5b7f8e" ON "${currentSchema}"."inv_categories" ("name") `);
        await queryRunner.query(`ALTER TABLE "${currentSchema}"."inv_stock_movements" ADD CONSTRAINT "FK_ffb6d8c25bbcdec7dad619b5e99" FOREIGN KEY ("materialId") REFERENCES "${currentSchema}"."inv_materials"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "${currentSchema}"."inv_stock_movements" ADD CONSTRAINT "FK_b67c3ad8058c47b131e4e88a423" FOREIGN KEY ("fromWarehouseId") REFERENCES "${currentSchema}"."inv_warehouses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "${currentSchema}"."inv_stock_movements" ADD CONSTRAINT "FK_d02e55615cb0a2c79752d630965" FOREIGN KEY ("toWarehouseId") REFERENCES "${currentSchema}"."inv_warehouses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "${currentSchema}"."inv_stocks" ADD CONSTRAINT "FK_5ac7e59af881cb7008d7988ae27" FOREIGN KEY ("materialId") REFERENCES "${currentSchema}"."inv_materials"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "${currentSchema}"."inv_stocks" ADD CONSTRAINT "FK_5c845f555849d51eb11739cea32" FOREIGN KEY ("warehouseId") REFERENCES "${currentSchema}"."inv_warehouses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "${currentSchema}"."inv_materials" ADD CONSTRAINT "FK_c227da6c874e8b5bd2d687e77cf" FOREIGN KEY ("categoryId") REFERENCES "${currentSchema}"."inv_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const options = queryRunner.connection.options as PostgresConnectionOptions;
        const currentSchema = options.schema;

        if (!currentSchema) throw new Error('Tenant schema is not defined...');

        await queryRunner.query(`ALTER TABLE "${currentSchema}"."inv_materials" DROP CONSTRAINT "FK_c227da6c874e8b5bd2d687e77cf"`);
        await queryRunner.query(`ALTER TABLE "${currentSchema}"."inv_stocks" DROP CONSTRAINT "FK_5c845f555849d51eb11739cea32"`);
        await queryRunner.query(`ALTER TABLE "${currentSchema}"."inv_stocks" DROP CONSTRAINT "FK_5ac7e59af881cb7008d7988ae27"`);
        await queryRunner.query(`ALTER TABLE "${currentSchema}"."inv_stock_movements" DROP CONSTRAINT "FK_d02e55615cb0a2c79752d630965"`);
        await queryRunner.query(`ALTER TABLE "${currentSchema}"."inv_stock_movements" DROP CONSTRAINT "FK_b67c3ad8058c47b131e4e88a423"`);
        await queryRunner.query(`ALTER TABLE "${currentSchema}"."inv_stock_movements" DROP CONSTRAINT "FK_ffb6d8c25bbcdec7dad619b5e99"`);
        await queryRunner.query(`DROP INDEX "${currentSchema}"."IDX_387f349805185e85011f5b7f8e"`);
        await queryRunner.query(`DROP TABLE "${currentSchema}"."inv_categories"`);
        await queryRunner.query(`DROP INDEX "${currentSchema}"."IDX_c227da6c874e8b5bd2d687e77c"`);
        await queryRunner.query(`DROP INDEX "${currentSchema}"."IDX_6bef7b58ad59182ceef75fa7d3"`);
        await queryRunner.query(`DROP TABLE "${currentSchema}"."inv_materials"`);
        await queryRunner.query(`DROP INDEX "${currentSchema}"."IDX_5c845f555849d51eb11739cea3"`);
        await queryRunner.query(`DROP INDEX "${currentSchema}"."IDX_5ac7e59af881cb7008d7988ae2"`);
        await queryRunner.query(`DROP TABLE "${currentSchema}"."inv_stocks"`);
        await queryRunner.query(`DROP INDEX "${currentSchema}"."IDX_d517cd224ac016722bd047bac3"`);
        await queryRunner.query(`DROP TABLE "${currentSchema}"."inv_warehouses"`);
        await queryRunner.query(`DROP INDEX "${currentSchema}"."IDX_b67c3ad8058c47b131e4e88a42"`);
        await queryRunner.query(`DROP INDEX "${currentSchema}"."IDX_d02e55615cb0a2c79752d63096"`);
        await queryRunner.query(`DROP INDEX "${currentSchema}"."IDX_ffb6d8c25bbcdec7dad619b5e9"`);
        await queryRunner.query(`DROP TABLE "${currentSchema}"."inv_stock_movements"`);
        await queryRunner.query(`DROP TYPE "${currentSchema}"."inv_stock_movements_movementtype_enum"`);
    }
}
