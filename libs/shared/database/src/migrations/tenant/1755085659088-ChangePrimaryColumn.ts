import { MigrationInterface, QueryRunner } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

export class ChangePrimaryColumn1755085659088 implements MigrationInterface {
    name = 'ChangePrimaryColumn1755085659088'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const options = queryRunner.connection.options as PostgresConnectionOptions;
        const currentSchema = options.schema;

        if (!currentSchema) throw new Error('Tenant schema is not defined...');

        await queryRunner.query(`ALTER TABLE "${currentSchema}"."tenant_users" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TYPE "${currentSchema}"."users_role_enum" RENAME TO "users_role_enum_old"`);
        await queryRunner.query(`CREATE TYPE "${currentSchema}"."tenant_users_role_enum" AS ENUM('super_admin', 'admin', 'manager', 'member')`);
        await queryRunner.query(`ALTER TABLE "${currentSchema}"."tenant_users" ALTER COLUMN "role" TYPE "${currentSchema}"."tenant_users_role_enum" USING "role"::"text"::"${currentSchema}"."tenant_users_role_enum"`);
        await queryRunner.query(`DROP TYPE "${currentSchema}"."users_role_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const options = queryRunner.connection.options as PostgresConnectionOptions;
        const currentSchema = options.schema;

        if (!currentSchema) throw new Error('Tenant schema is not defined...');

        await queryRunner.query(`CREATE TYPE "${currentSchema}"."users_role_enum_old" AS ENUM('super_admin', 'admin', 'manager', 'member')`);
        await queryRunner.query(`ALTER TABLE "${currentSchema}"."tenant_users" ALTER COLUMN "role" TYPE "${currentSchema}"."users_role_enum_old" USING "role"::"text"::"${currentSchema}"."users_role_enum_old"`);
        await queryRunner.query(`DROP TYPE "${currentSchema}"."tenant_users_role_enum"`);
        await queryRunner.query(`ALTER TYPE "${currentSchema}"."users_role_enum_old" RENAME TO "users_role_enum"`);
        await queryRunner.query(`ALTER TABLE "${currentSchema}"."tenant_users" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
    }
}
