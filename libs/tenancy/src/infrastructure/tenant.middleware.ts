import { 
    Injectable, NestMiddleware, 
    UnauthorizedException, NotFoundException 
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantService } from '../application/tenant.service';

// Tenant middleware to resolve tenant's schema
@Injectable()
export class TenantMiddleware implements NestMiddleware {
    constructor(private readonly tenantService: TenantService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const tenantId = req.headers['x-tenant-id'] as string;
        if (!tenantId) throw new UnauthorizedException('Tenant ID must be provided');

        const tenant = await this.tenantService.resolveTenant(tenantId);
        if (!tenant) throw new NotFoundException('Tenant not found');

        await this.tenantService.setSearchPath(tenant.schema);
        (req as any).tenant = tenant;

        next();
    }
}
