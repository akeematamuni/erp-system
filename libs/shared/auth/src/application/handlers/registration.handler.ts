import { ConflictException, InternalServerErrorException, LoggerService } from '@nestjs/common';
import { RoleType } from '@erp-system/shared-types';
import { User, UserService } from '@erp-system/users';
import { RegisterTenantDto } from '../../presentation/dto/register-tenant.dto';
import { TenantService, rollbackTenantCreation } from '@erp-system/tenancy';
import * as bcrypt from 'bcrypt';

// Register specific handler function
export async function registerNewTenantAndAdmin(
    dto: RegisterTenantDto, 
    maxRetries: number,
    logger: LoggerService,
    userService: UserService,
    tenantService: TenantService,
    
): Promise<any> {
    
    const { enterpriseName, fullName, email, password: pwd } = dto;
    let retries = 0;

    while (retries < maxRetries) {
        try {
            const { 
                tenant, tenantDataSource, dataSource
            } = await tenantService.registerTenant(enterpriseName);

            const password = await bcrypt.hash(pwd, 10);

            try {
                const user = await tenantService.registerPublicUser(
                    fullName, email, password, tenant.id
                );

                const superAdmin = new User();
                superAdmin.fullname = user.fullname;
                superAdmin.email = user.email;
                superAdmin.role = RoleType.SUPER_ADMIN;

                const newSuperAdmin = await userService.addNewTenantUser(
                    tenantDataSource, superAdmin
                );
                
                logger.log(`Super admin created for tenant: ${tenant.id} | ${tenant.schema}`);
                return {...user, ...newSuperAdmin};

            } catch (error) {
                // logger.error(`Failed to create "${tenant.schema}" super admin..`);
                await rollbackTenantCreation(tenant.schema, tenant, logger, dataSource);
                throw new InternalServerErrorException(
                    'Error occured during registration, please try later...'
                );
            }

        } catch (error) {
            logger.error(
                `Failed to create "${enterpriseName}" on attempt: ${retries + 1}\n"${error}"`
            );

            if (error instanceof ConflictException) throw error;
            
            retries++;
            if (retries >= maxRetries) throw error;

            const delay = 2000 * Math.pow(2, retries - 1);
            logger.log(`Waiting ${delay / 2000} seconds before retrying...`);
            await new Promise(resolve => setTimeout(resolve, delay)); // ****
        }
    }
}
