import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { LoggerToken, CustomLoggerService } from '@erp-system/shared-logger';
import { TenantService } from '@erp-system/tenancy';
import { RegisterTenantDto } from '../presentation/dto/register-tenant.dto';
import { registerNewTenantAndAdmin } from './handlers/registration.handler';

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

    async registerTenant(dto: RegisterTenantDto, maxRetries = 3): Promise<any> {
        return await registerNewTenantAndAdmin(
            dto, this.logger, this.tenantService, maxRetries
        );
    }

    // ToDo: Login flow ...
    async loginTenant() {}
}
