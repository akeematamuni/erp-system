import { DataSource } from 'typeorm';
import { TenantService } from '@erp-system/tenancy';
import { UserRepository } from '../../infrastructure/user.repository';
import { LoginUserDto } from '../../presentation/dto/login-tenant.dto';
import { InternalServerErrorException, LoggerService, UnauthorizedException } from '@nestjs/common';
import { tenantDataOptions } from '@erp-system/shared-database';
import * as bcrypt from 'bcrypt';

export async function loginTenantUser(
    dto: LoginUserDto,
    logger: LoggerService,
    tenantService: TenantService
) {
    let localDataSource: DataSource | null = null;

    try {
        const publicUser = await tenantService.resolvePublicUserEmail(dto.email);

        if (!publicUser) {
            logger.error(`Error getting user with "${dto.email}" for login..`);
            throw new UnauthorizedException('Invalid email or password...');
        }

        const correctPassword = await bcrypt.compare(dto.password, publicUser.password);

        if (!correctPassword) {
            logger.error(`Wrong password for user "${publicUser.email}"`);
            throw new UnauthorizedException('Invalid email or password...');
        }

        const schema = publicUser.tenant.schema;
        localDataSource = new DataSource({
            ...tenantDataOptions,
            schema
        });
        await localDataSource.initialize();

        const localUser = await new UserRepository(localDataSource).findByEmail(publicUser.email);
        return {...localUser };

    } catch (error) {
        logger.error(`Error during login..\n${error}`);

        if (error instanceof UnauthorizedException) throw error;

        throw new InternalServerErrorException('Unable to login, please try later...');

    } finally {
        if (localDataSource && localDataSource.isInitialized) {
            await localDataSource.destroy();
        }
    }
}
