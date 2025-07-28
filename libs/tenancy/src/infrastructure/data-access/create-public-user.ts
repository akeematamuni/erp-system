import { ConflictException, InternalServerErrorException, LoggerService } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { PublicUser } from '../../domain/public-user.entity';

export async function createNewUser(
    fullname: string, 
    email: string, 
    password: string, 
    tenantId: string,
    logger: LoggerService,
    dataSource: DataSource
) {
    const existing = await dataSource.getRepository(PublicUser).findOne({ where: { email }});

    if (existing) {
        logger.warn(`"${email}" already exist...`);
        throw new ConflictException(`User with "${email} already exist..."`);
    }

    const queryRunner = dataSource.createQueryRunner();

    try {
        await queryRunner.connect();
        await queryRunner.startTransaction();

        const newUser = queryRunner.manager.create(PublicUser, { 
            fullname, email, password, tenantId
        });
        
        await queryRunner.manager.save(newUser);
        await queryRunner.commitTransaction();

        logger.log(`User with "${email}" has been created...`);
        return newUser;

    } catch (error) {
        if (queryRunner.isTransactionActive) {
            await queryRunner.rollbackTransaction();
        }

        if (!queryRunner.isReleased) await queryRunner.release();

        logger.error(`Error creating user with "${email}"\n${error}`);
        throw new InternalServerErrorException(`Error creating user with "${email}`)
    }
}
