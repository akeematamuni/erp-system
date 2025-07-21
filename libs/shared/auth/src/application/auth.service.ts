import { Inject, Injectable, InternalServerErrorException, LoggerService } from '@nestjs/common';
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

    async registerTenant(dto: RegisterTenantDto): Promise<User> {
        const { enterpriseName, fullName, email, password: pwd } = dto;

        const { 
            tenant, tenantDataSource
        } = await this.tenantService.registerTenant(enterpriseName);

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
            this.logger.error(`Could not create ${tenant.schema} super admin..`);
            throw new InternalServerErrorException('Error occured, try latter...');
        }
    }

    // async registerUsers() {

    // }
}
