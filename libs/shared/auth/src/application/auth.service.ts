import { Inject, Injectable, InternalServerErrorException, ConflictException, LoggerService } from '@nestjs/common';
import { LoggerToken, CustomLoggerService } from '@erp-system/shared-logger';
import { TenantService } from '@erp-system/tenancy';
import { User } from '../domain/user.entity';
import { RoleType } from '../domain/enums';
import { UserRepository } from '../infrastructure/user.repository';
import { RegisterTenantDto } from '../presentation/dto/register-tenant.dto';
import * as bcrypt from 'bcrypt';

// cont with implem....
@Injectable()
export class AuthService {
    private readonly logger: LoggerService;

    constructor(
        @Inject(LoggerToken) private readonly base: CustomLoggerService,
        private readonly tenantService: TenantService,
    ) {
        this.logger = base.addContext(AuthService.name);
    }

    // *****************
    async registerTenant(dto: RegisterTenantDto, maxRetries = 3): Promise<any> {
        const { enterpriseName, fullName, email, password: pwd } = dto;
        let retries = 0;

        // Multiple tries for setting up tenant with back-off
        while (retries < maxRetries) {
            try {
                const { 
                    tenant, tenantDataSource
                } = await this.tenantService.registerTenant(enterpriseName);
                // 
                const password = await bcrypt.hash(pwd, 10);

                // Create tenant's super admin
                try {
                    const superAdmin = new User();
                    superAdmin.tenantId = tenant.id;
                    superAdmin.fullname = fullName;
                    superAdmin.email = email;
                    superAdmin.password = password;
                    superAdmin.role = RoleType.SUPER_ADMIN;

                    const userRepo = new UserRepository(tenantDataSource);
                    const newSuperAdmin = await userRepo.save(superAdmin);

                    this.logger.log(`Super admin created for tenant: ${tenant.id} | ${tenant.schema}`);
                    return newSuperAdmin;

                } catch (error) {
                    this.logger.error(`Failed to create "${tenant.schema}" super admin..`);
                    await this.tenantService.rollbackCreation(tenant.schema, tenant);
                    throw new InternalServerErrorException(
                        'Error occured during registration, please try later...'
                    );
                }
            } catch (error) {
                if (error instanceof ConflictException) throw error;
                this.logger.error(
                    `Failed to create "${enterpriseName}" on attempt: ${retries + 1}\n"${error}"`
                );

                retries++;
                if (retries >= maxRetries) throw error;

                const delay = 2000 * Math.pow(2, retries - 1);
                this.logger.log(`Waiting ${delay / 2000} seconds before retrying...`);
                await new Promise(resolve => setTimeout(resolve, delay)); // ****
            }
        }
    }

    // ToDo: Login flow ...
}
