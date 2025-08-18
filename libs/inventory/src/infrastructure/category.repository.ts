import { Injectable, Inject, LoggerService } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InvCategory } from '../domain/entities/category.entity';
import { ICategoryRepository } from '../domain/interfaces/category-repo.interface';
import { LoggerToken, CustomLoggerService } from '@erp-system/shared-logger';

@Injectable()
export class InvCategoryRepository implements ICategoryRepository {
    private readonly logger: LoggerService;

    constructor(
        private readonly dataSource: DataSource,
        @Inject(LoggerToken) private readonly base: CustomLoggerService,
    ) {
        this.logger = base.addContext(InvCategoryRepository.name);
    }

    async save(category: InvCategory, schema: string): Promise<InvCategory> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.query(`SET search_path TO ${schema}, public`);
            const newCategory = await queryRunner.manager.save(category);
            await queryRunner.commitTransaction();
            return newCategory;

        } catch (error) {
            if (queryRunner.isTransactionActive) await queryRunner.rollbackTransaction();
            this.logger.error(
                `Error occured trying to save inventory category in ${schema}\n${error}`
            );
            throw error;

        } finally {
            if (!queryRunner.isReleased) await queryRunner.release();
        }
    }

    async findByName(name: string, schema: string): Promise<InvCategory | null> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            await queryRunner.query(`SET search_path TO ${schema}, public`);
            return await queryRunner.manager.findOne(InvCategory, { where: { name } });

        } catch (error) {
            this.logger.error(
                `Error occured trying to find inventory category in ${schema}\n${error}`
            );
            throw error;

        } finally {
            if (!queryRunner.isReleased) await queryRunner.release();
        }
    }

    async findById(id: string, schema: string): Promise<InvCategory | null> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            await queryRunner.query(`SET search_path TO ${schema}, public`);
            return await queryRunner.manager.findOne(InvCategory, { where: { id } });

        } catch (error) {
            this.logger.error(
                `Error occured trying to find inventory category in ${schema}\n${error}`
            );
            throw error;

        } finally {
            if (!queryRunner.isReleased) await queryRunner.release();
        }
    }

    async findAll(schema: string): Promise<InvCategory[]> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            await queryRunner.query(`SET search_path TO ${schema}, public`);
            return await queryRunner.manager.find(InvCategory);

        } catch (error) {
            this.logger.error(
                `Error occured trying to find all inventory category ${schema}\n${error}`
            );
            throw error;

        } finally {
            if (!queryRunner.isReleased) await queryRunner.release();
        }
    }
}
