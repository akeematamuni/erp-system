import { Injectable, Inject, LoggerService } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InvWarehouse } from '../domain/entities/warehouse.entity';
import { IWarehouseRepository } from '../domain/interfaces/warehouse-repo.interface';
import { CustomLoggerService, LoggerToken } from '@erp-system/shared-logger';

@Injectable()
export class InvWarehouseRepository implements IWarehouseRepository {
    private readonly logger: LoggerService;

    constructor(
        private readonly dataSource: DataSource,
        @Inject(LoggerToken) private readonly base: CustomLoggerService
    ) {
        this.logger = base.addContext(InvWarehouseRepository.name);
    }

    async save(warehouse: InvWarehouse, schema: string): Promise<InvWarehouse> {
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            queryRunner.query(`SET search_path TO ${schema}, public`);
            const newWarehouse =  await queryRunner.manager.save(warehouse);
            await queryRunner.commitTransaction();
            return newWarehouse;
            
        } catch (error) {
            if (queryRunner.isTransactionActive) await queryRunner.rollbackTransaction();
            this.logger.error(`Error creating new inventory warehouse in ${schema}\n${error}`);
            throw error;
            
        } finally {
            if (!queryRunner.isReleased) await queryRunner.release();
        }
    }

    async findAll(schema: string): Promise<InvWarehouse[]> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        
        try {
            queryRunner.query(`SET search_path TO ${schema}, public`);
            return await queryRunner.manager.find(InvWarehouse);

        } catch (error) {
            this.logger.error(`Error finding warehouses in ${schema}\n${error}`);
            throw error;

        } finally {
            if (!queryRunner.isReleased) await queryRunner.release();
        }
    }

    async findById(id: string, schema: string): Promise<InvWarehouse | null> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        
        try {
            queryRunner.query(`SET search_path TO ${schema}, public`);
            return await queryRunner.manager.findOne(InvWarehouse, { where: { id } });

        } catch (error) {
            this.logger.error(`Error finding warehouse in ${schema}\n${error}`);
            throw error;

        } finally {
            if (!queryRunner.isReleased) await queryRunner.release();
        }
    }

    async findByCode(code: string, schema: string): Promise<InvWarehouse | null> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        
        try {
            queryRunner.query(`SET search_path TO ${schema}, public`);
            return await queryRunner.manager.findOne(InvWarehouse, { where: { code } });

        } catch (error) {
            this.logger.error(`Error finding warehouse in ${schema}\n${error}`);
            throw error;

        } finally {
            if (!queryRunner.isReleased) await queryRunner.release();
        }
    }
}
