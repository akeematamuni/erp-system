import { MigrationInterface, QueryRunner } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

export class CreateUserTable1753118629025 implements MigrationInterface {
    name = 'CreateUserTable1753118629025'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const options = queryRunner.connection.options as PostgresConnectionOptions;
        const currentSchema = options.schema;

        if (!currentSchema) throw new Error('Tenant schema is not defined...');

        await queryRunner.query(`CREATE TYPE "${currentSchema}"."users_role_enum" AS ENUM('super_admin', 'admin', 'manager', 'member')`);
        await queryRunner.query(`CREATE TABLE "${currentSchema}"."users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fullname" character varying NOT NULL, "role" "${currentSchema}"."users_role_enum" NOT NULL, "department" character varying, "createdBy" character varying, "isActive" boolean NOT NULL DEFAULT true, "email" character varying NOT NULL, "password" character varying NOT NULL, "tenantId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3_${currentSchema}" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433_${currentSchema}" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const options = queryRunner.connection.options as PostgresConnectionOptions;
        const currentSchema = options.schema;

        if (!currentSchema) throw new Error('Tenant schema is not defined...');

        await queryRunner.query(`DROP TABLE "${currentSchema}"."users"`);
        await queryRunner.query(`DROP TYPE "${currentSchema}"."users_role_enum"`);
    }

}
