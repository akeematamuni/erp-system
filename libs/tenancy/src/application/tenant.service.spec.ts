import { DataSource } from 'typeorm';
import { Tenant } from '../domain/tenant.entity';
import { TenantService } from './tenant.service';
import { TenantRepository } from '../infrastructure/tenant.repository';

describe('TenantService', () => {
    const tenant = { id: 'testId', name: 'testName', schema: 'tenant_testName' } as Tenant;
    const dataSource = { query: jest.fn() } as unknown as DataSource;
    const repo = {
        findById: jest.fn(),
        setSchema: jest.fn(),
        createTenant: jest.fn()
    } as unknown as TenantRepository;

    let service: TenantService;

    beforeEach(() => {
        service = new TenantService(repo);
        jest.clearAllMocks();
    });

    it('registers a new tenant', async () => {
        repo.createTenant = jest.fn().mockResolvedValue(tenant);
        const result = await service.registerTenant(tenant.name);

        expect(repo.createTenant).toHaveBeenCalledWith('testName');
        expect(result).toEqual(tenant);
    });

    it('resolve tenant using repo', async () => {
        repo.findById = jest.fn().mockResolvedValue(tenant);
        const result = await service.resolveTenant('testId');

        expect(repo.findById).toHaveBeenCalledWith(tenant.id);
        expect(result).toEqual(tenant);
    });

    it('set search_path using schema', async () => {
        await service.setSearchPath(tenant.schema);
        expect(repo.setSchema).toHaveBeenCalledWith(tenant.schema);
    });
})
