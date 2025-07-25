import { ConflictException, InternalServerErrorException, LoggerService } from '@nestjs/common';
import { RoleType } from '../../domain/enums';
import { User } from '../../domain/user.entity';
import { UserRepository } from '../../infrastructure/user.repository';
import { RegisterTenantDto } from '../../presentation/dto/register-tenant.dto';
import { TenantService } from '@erp-system/tenancy';
import { rollbackTenantCreation } from '@erp-system/tenancy';
import * as bcrypt from 'bcrypt';

// Register specific handler function
export async function registerNewTenantAndAdmin(
    dto: RegisterTenantDto, 
    logger: LoggerService,
    tenantService: TenantService,
    maxRetries: number
): Promise<any> {
    
    const { enterpriseName, fullName, email, password: pwd } = dto;
    let retries = 0;

    while (retries < maxRetries) {
        try {
            const { 
                tenant, tenantDataSource, dataSource
            } = await tenantService.registerTenant(enterpriseName);
            // 
            const password = await bcrypt.hash(pwd, 10);

            try {
                const superAdmin = new User();
                superAdmin.tenantId = tenant.id;
                superAdmin.fullname = fullName;
                superAdmin.email = email;
                superAdmin.password = password;
                superAdmin.role = RoleType.SUPER_ADMIN;

                const userRepo = new UserRepository(tenantDataSource);
                const newSuperAdmin = await userRepo.save(superAdmin);

                logger.log(`Super admin created for tenant: ${tenant.id} | ${tenant.schema}`);
                return newSuperAdmin;

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
