import { UnauthorizedException, NotFoundException, LoggerService } from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomLoggerService } from '@erp-system/shared-logger';
import { TenantService } from '../application/tenant.service';
import { Tenant } from '../domain/tenant.entity';
import { TenantMiddleware } from './tenant.middleware';

describe('TenantMiddleware', () => {
    const tenantService = { 
        resolveTenant: jest.fn(),
        setSearchPath: jest.fn()
    } as unknown as TenantService;

    const logger = {
        log: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
    } as unknown as LoggerService;

    const tenant = { id: 'testId', name: 'testName', schema: 'testSchema' } as Tenant;

    let middleware: TenantMiddleware;

    beforeEach(() => {
        const baseLogger: Partial<CustomLoggerService> = {
            addContext: () => logger
        };

        middleware = new TenantMiddleware(baseLogger as CustomLoggerService, tenantService);
    });

    it('throw UnauthorizedException if tenant ID is missing', async () => {
        const req = { headers: {} } as Request;
        const res = {} as Response;
        const next = jest.fn();

        await expect(middleware.use(req, res, next)).rejects.toThrow(UnauthorizedException);
        expect(logger.warn).toHaveBeenCalledWith('Tenant ID was not provided..');
    });

    it('throw NotFoundException if tenant not found', async () => {
        const req = { headers: { 'x-tenant-id': `${tenant.id}` } } as unknown as Request;
        const res = {} as Response;
        const next = jest.fn();

        tenantService.resolveTenant = jest.fn().mockResolvedValue(null);

        await expect(middleware.use(req, res, next)).rejects.toThrow(NotFoundException);
        expect(logger.warn).toHaveBeenCalledWith(`Tenant with ID: ${tenant.id} was not not found..`);
    });

    it('set search_path and attach tenant to request', async () => {
        const req = { headers: { 'x-tenant-id': `${tenant.id}` } } as unknown as Request;
        const res = {} as Response;
        const next = jest.fn();

        tenantService.resolveTenant = jest.fn().mockResolvedValue(tenant);
        await middleware.use(req, res, next);

        expect(tenantService.setSearchPath).toHaveBeenCalledWith(`${tenant.schema}`);
        expect((req as any).tenant).toEqual(tenant);
        expect(logger.log).toHaveBeenCalledWith(`Tenant "${tenant.id}" schema resolved to ${tenant.schema}`);
        expect(next).toHaveBeenCalled();
    });
});
