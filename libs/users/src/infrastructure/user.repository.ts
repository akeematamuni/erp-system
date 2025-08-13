import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../domain/user.entity';
import { IUserRepository } from '../domain/user.repository.interface';
import { LoggerToken, CustomLoggerService } from '@erp-system/shared-logger';

@Injectable()
export class UserRepository implements IUserRepository {
    private readonly logger: LoggerService;

    constructor(
        @Inject(LoggerToken) private readonly base: CustomLoggerService,
        private readonly dataSource: DataSource,
    ) {
        this.logger = base.addContext(UserRepository.name);
    }

    async save(user: User, schema: string): Promise<User> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            queryRunner.query(`SET search_path TO ${schema}, public`);
            const newTenantUser = await queryRunner.manager.save(user);
            await queryRunner.commitTransaction();

            this.logger.log(`User "${newTenantUser.email}" created successfully in ${schema}`);
            return newTenantUser;

        } catch (error) {
            if (queryRunner.isTransactionActive) await queryRunner.rollbackTransaction();
            this.logger.error(`Error creating "${user.email}" in ${schema}\n${error}`);
            throw error;

        } finally {
            if (!queryRunner.isReleased) await queryRunner.release();
        }
    }

    async findById(id: string, schema: string): Promise<User | null> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            queryRunner.query(`SET search_path TO ${schema}, public`);
            return await queryRunner.manager.findOne(User, { where: { id } });

        } catch (error) {
            this.logger.error(`Error finding user "${id}" in ${schema}\n${error}`);
            throw error;

        } finally {
            if (!queryRunner.isReleased) await queryRunner.release();
        }
    }

    async findByEmail(email: string, schema: string): Promise<User | null> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            queryRunner.query(`SET search_path TO ${schema}, public`);
            return await queryRunner.manager.findOne(User, { where: { email } });

        } catch (error) {
            this.logger.error(`Error finding user "${email}" in ${schema}\n${error}`);
            throw error;

        } finally {
            if (!queryRunner.isReleased) await queryRunner.release();
        }
    }

    async doesUserExist(email: string, schema: string): Promise<boolean> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            await queryRunner.query(`SET search_path TO ${schema}, public`);
            return await queryRunner.manager.count(User, { where: { email } }) > 0;

        } catch (error) {
            this.logger.error(`Error finding user "${email}" in ${schema}\n${error}`)
            throw error;

        } finally {
            if (!queryRunner.isReleased) await queryRunner.release();
        }
    }

    async findByDepartment(department: string, schema: string): Promise<User[]> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            queryRunner.query(`SET search_path TO ${schema}, public`);
            return await queryRunner.manager.find(User, { where: { department } });

        } catch (error) {
            this.logger.error(`Error finding user by department in ${schema}\n${error}`);
            throw error;

        } finally {
            if (!queryRunner.isReleased) await queryRunner.release();
        }
    }
}
