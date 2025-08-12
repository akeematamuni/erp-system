import { InternalServerErrorException, LoggerService, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TenantService } from '@erp-system/tenancy';
import { UserService } from '@erp-system/users';
import { LoginUserDto } from '../../presentation/dto/login-tenant.dto';
import { tenantDataOptions } from '@erp-system/shared-database';
import * as bcrypt from 'bcrypt';

export async function loginTenantUser(
    dto: LoginUserDto,
    logger: LoggerService,
    userService: UserService,
    tenantService: TenantService
): Promise<any> {
    let tenantDataSource: DataSource | null = null;
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
            tenantDataSource = new DataSource({
                ...tenantDataOptions,
                schema
            });
            await tenantDataSource.initialize();

            const tenantUser = await userService.findTenantUserByEmail(
                tenantDataSource, publicUser.email
            );

            if (!tenantUser) {
                logger.error(`Tenant user search returned null`);
                throw new NotFoundException('User not found...');
            }

            return { publicUser, tenantUser };

        } catch (error) {
            logger.error(`Error during login..\n${error}`);

            if (error instanceof UnauthorizedException) throw error;
            if (error instanceof NotFoundException) throw error;

            retries++;
            if (retries >= maxRetries) {

                if (tenantDataSource && tenantDataSource.isInitialized) {
                    await tenantDataSource.destroy();
                }
                
                throw new InternalServerErrorException('Unable to login, please try later...');
            };

            const delay = 2000 * Math.pow(2, retries - 1);
            logger.log(`Waiting ${delay / 2000} seconds before retrying login...`);
            await new Promise(resolve => setTimeout(resolve, delay)); // ****
        }
    }
}
