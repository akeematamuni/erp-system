import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { LoggerToken, CustomLoggerService } from '@erp-system/shared-logger';
import { TenantService, PublicUser } from '@erp-system/tenancy';
import { RegisterTenantDto } from '../presentation/dto/register-tenant.dto';
import { LoginUserDto } from '../presentation/dto/login-tenant.dto';
import { registerNewTenantAndAdmin } from './handlers/registration.handler';
import { loginTenantUser } from './handlers/login.handler';
import { SharedTokenService } from '@erp-system/shared-token';
import { generateTokens } from './handlers/token.handler';
import { User } from '../domain/user.entity';

// cont with implem....
@Injectable()
export class AuthService {
    private readonly logger: LoggerService;

    constructor(
        @Inject(LoggerToken) private readonly base: CustomLoggerService,
        private readonly tenantService: TenantService,
        private readonly tokenService: SharedTokenService
    ) {
        this.logger = base.addContext(AuthService.name);
    }

    async registerTenant(dto: RegisterTenantDto, maxRetries = 3): Promise<any> {
        return await registerNewTenantAndAdmin(
            dto, this.logger, this.tenantService, maxRetries
        );
    }

    // ToDo: Login flow ...
    async loginUser(dto: LoginUserDto) {
        const responseObj = await loginTenantUser(
            dto, this.logger, this.tenantService
        ) as { publicUser: PublicUser, localUser: User };

        const payload = {
            id: responseObj.publicUser.id,
            role: responseObj.localUser.role,
            orgId: responseObj.publicUser.tenantId
        };

        return await generateTokens(this.tokenService, this.logger, payload);
    }
}
