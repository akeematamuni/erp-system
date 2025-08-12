import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { LoggerToken, CustomLoggerService } from '@erp-system/shared-logger';
import { TenantService } from '@erp-system/tenancy';
import { UserService } from '@erp-system/users';
import { RegisterTenantDto } from '../presentation/dto/register-tenant.dto';
import { LoginUserDto } from '../presentation/dto/login-tenant.dto';
import { registerNewTenantAndAdmin } from './handlers/registration.handler';
import { loginTenantUser } from './handlers/login.handler';
import { SharedTokenService } from '@erp-system/shared-token';
import { generateTokens } from './handlers/token.handler';

// cont with implem....
@Injectable()
export class AuthService {
    private readonly logger: LoggerService;

    constructor(
        @Inject(LoggerToken) private readonly base: CustomLoggerService,
        private readonly tenantService: TenantService,
        private readonly tokenService: SharedTokenService,
        private readonly userService: UserService
    ) {
        this.logger = base.addContext(AuthService.name);
    }

    async registerTenant(dto: RegisterTenantDto, maxRetries = 3): Promise<any> {
        return await registerNewTenantAndAdmin(
            dto, maxRetries, this.logger, this.userService, this.tenantService
        );
    }

    // ToDo: Login flow ...
    async loginUser(dto: LoginUserDto) {
        const responseObj = await loginTenantUser(
            dto, this.logger, this.userService, this.tenantService
        )

        const payload = {
            id: responseObj.publicUser.id,
            role: responseObj.tenantUser.role,
            orgId: responseObj.publicUser.tenantId
        };

        return await generateTokens(this.tokenService, this.logger, payload);
    }
}
