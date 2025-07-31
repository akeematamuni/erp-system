import { Injectable, CanActivate, ExecutionContext, LoggerService, Inject, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { LoggerToken, CustomLoggerService } from '@erp-system/shared-logger';
import { ROLES_KEY } from '../decorator/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    private readonly logger: LoggerService;

    constructor(
        private reflector: Reflector,
        @Inject(LoggerToken) private readonly base: CustomLoggerService
    ) {
        this.logger = base.addContext(RolesGuard.name);
    }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(
            ROLES_KEY, [context.getHandler(), context.getClass()]
        );

        const { user } = context.switchToHttp().getRequest();

        if (!user) {
            this.logger.error(`Access denied, there was no authenticated user..."`);
            throw new ForbiddenException('Credential error...');
        };

        // Log the issue to know troublesome users
        if (!requiredRoles.includes(user.role?.name)) {
            this.logger.warn(`Access denied for user "${user.id}..."`);
            return false;
        };

        return true;
    }
}
