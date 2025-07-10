import { 
    Injectable, NestMiddleware, UnauthorizedException, 
    NotFoundException, LoggerService, Inject
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantService } from '../application/tenant.service';
import { LoggerToken, CustomLoggerService } from '@erp-system/shared-logger';

// Middleware to resolve tenant's schema
@Injectable()
export class TenantMiddleware implements NestMiddleware {
    private readonly logger: LoggerService;

    constructor(
        @Inject(LoggerToken) base: CustomLoggerService,
        private readonly tenantService: TenantService
    ) {
        this.logger = base.addContext(TenantMiddleware.name);
    }

    async use(req: Request, res: Response, next: NextFunction) {
        const tenantId = req.headers['x-tenant-id'] as string;
        if (!tenantId) {
            this.logger.warn('Tenant ID was not provided..')
            throw new UnauthorizedException('Tenant ID must be provided..');
        }

        const tenant = await this.tenantService.resolveTenant(tenantId);
        if (!tenant) {
            this.logger.warn(`Tenant with ID: ${tenantId} was not not found..`);
            throw new NotFoundException('Tenant not found..');
        }

        this.logger.log(`Tenant "${tenantId}" schema resolved to ${tenant.schema}`);
        await this.tenantService.setSearchPath(tenant.schema);
        (req as any).tenant = tenant;

        next();
    }
}
