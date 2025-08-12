import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameUsersToCentralUsers1754940837190 implements MigrationInterface {
    name = 'RenameUsersToCentralUsers1754940837190'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameTable('users', 'central_users');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameTable('central_users', 'users');
    }
}
