import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CustomLoggerService, LoggerToken } from '@erp-system/shared-logger';
import { InvMaterial } from '../domain/entities/material.entity';
import { IMaterialRepository } from '../domain/interfaces/material-repo.interface';

@Injectable()
export class InvMaterialRepoitory implements IMaterialRepository {
    private readonly logger: LoggerService;

    constructor(
        @Inject(LoggerToken) base: CustomLoggerService,
        private readonly dataSource: DataSource
    ) {
        this.logger = base.addContext(InvMaterialRepoitory.name);
    }

    async save(material: InvMaterial, schema: string): Promise<InvMaterial> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.query(`SET search_path TO ${schema},public`);
            const newMaterial = await queryRunner.manager.save(material);
            await queryRunner.commitTransaction();
            return newMaterial;

        } catch (error) {
            if (queryRunner.isTransactionActive) await queryRunner.rollbackTransaction();
            this.logger.error(`Error creating new material in ${schema}\n${error}`);
            throw error;

        } finally {
            if(!queryRunner.isReleased) await queryRunner.release();
        }
    }

    async findAll(schema: string): Promise<InvMaterial[]> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            await queryRunner.query(`SET search_path TO ${schema},public`);
            return await queryRunner.manager.find(InvMaterial);

        } catch (error) {
            this.logger.error(`Error getting materials in ${schema}\n${error}`);
            throw error;

        } finally {
            if(!queryRunner.isReleased) await queryRunner.release();
        }
    }

    async findBySku(sku: string, schema: string): Promise<InvMaterial | null> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            await queryRunner.query(`SET search_path TO ${schema},public`);
            return await queryRunner.manager.findOne(InvMaterial, { where: { sku } });

        } catch (error) {
            this.logger.error(`Error getting material ${sku} in ${schema}\n${error}`);
            throw error;

        } finally {
            if(!queryRunner.isReleased) await queryRunner.release();
        }
    }
}
