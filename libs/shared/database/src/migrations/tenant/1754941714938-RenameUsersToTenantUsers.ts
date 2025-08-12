import { MigrationInterface, QueryRunner } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

export class RenameUsersToTenantUsers1754941714938 implements MigrationInterface {
    name = 'RenameUsersToTenantUsers1754941714938'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const options = queryRunner.connection.options as PostgresConnectionOptions;
        const currentSchema = options.schema;

        if (!currentSchema) throw new Error('Tenant schema is not defined...');

        await queryRunner.query(
            `ALTER TABLE "${currentSchema}"."users" RENAME TO "tenant_users";`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const options = queryRunner.connection.options as PostgresConnectionOptions;
        const currentSchema = options.schema;

        if (!currentSchema) throw new Error('Tenant schema is not defined...');

        await queryRunner.query(
            `ALTER TABLE "${currentSchema}"."tenant_users" RENAME TO "users";`
        );
    }
}
