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
        const password = await bcrypt.hash(pwd, 10);

        try {
            const { tenant, dataSource } = await tenantService.registerTenant(enterpriseName);

            try {
                const superAdmin = await tenantService.registerPublicUser(
                    fullName, email, password, tenant.id
                );

                if (!superAdmin) throw Error();

                const tenantSuperAdmin = new User();
                tenantSuperAdmin.id = superAdmin.id;
                tenantSuperAdmin.fullname = superAdmin.fullname;
                tenantSuperAdmin.email = superAdmin.email;
                tenantSuperAdmin.role = RoleType.SUPER_ADMIN;

                const newTenantSuperAdmin = await userService.addNewTenantUser(
                    tenantSuperAdmin, tenant.schema
                );
                
                logger.log(`Super admin created for tenant: ${tenant.id} | ${tenant.schema}`);
                return {...superAdmin, ...newTenantSuperAdmin};

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
