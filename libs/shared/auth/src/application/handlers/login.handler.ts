import { DataSource } from 'typeorm';
import { TenantService } from '@erp-system/tenancy';
import { User } from '../../domain/user.entity';
import { UserRepository } from '../../infrastructure/user.repository';
import { LoginUserDto } from '../../presentation/dto/login-tenant.dto';
import { InternalServerErrorException, LoggerService, UnauthorizedException } from '@nestjs/common';
import { tenantDataOptions } from '@erp-system/shared-database';
import * as bcrypt from 'bcrypt';

export async function loginTenantUser(
    dto: LoginUserDto,
    logger: LoggerService,
    tenantService: TenantService
): Promise<any> {
    let localDataSource: DataSource | null = null;
    let maxRetries = 3;
    let retries = 0;

    while (retries < maxRetries) {
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

            const user = new UserRepository(localDataSource);
            const localUser = await user.findByEmail(publicUser.email) as User;

            return { publicUser, localUser };

        } catch (error) {
            logger.error(`Error during login..\n${error}`);

            if (error instanceof UnauthorizedException) throw error;

            retries++;
            if (retries >= maxRetries) {

                if (localDataSource && localDataSource.isInitialized) {
                    await localDataSource.destroy();
                }
                
                throw new InternalServerErrorException('Unable to login, please try later...');
            };

            const delay = 2000 * Math.pow(2, retries - 1);
            logger.log(`Waiting ${delay / 2000} seconds before retrying login...`);
            await new Promise(resolve => setTimeout(resolve, delay)); // ****
        }
    }
}
