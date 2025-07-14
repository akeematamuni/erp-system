import { DataSource } from 'typeorm';
import { Tenant } from '../domain/tenant.entity';
import { TenantService } from './tenant.service';
import { TenantRepository } from '../infrastructure/tenant.repository';

describe('TenantService', () => {
    const dataSource = { query: jest.fn() } as unknown as DataSource;
    const repo = { findById: jest.fn() } as unknown as TenantRepository;
    const tenant = { id: 'testId', name: 'testName', schema: 'testSchema' } as Tenant;

    let service: TenantService;

    beforeEach(() => {
        service = new TenantService(dataSource, repo);
        jest.clearAllMocks();
    });

    it('resolve tenant using repo', async () => {
        repo.findById = jest.fn().mockResolvedValue(tenant);
        const result = await service.resolveTenant('testId');

        expect(repo.findById).toHaveBeenCalledWith(tenant.id);
        expect(result).toEqual(tenant);
    });

    it('set search_path using schema', async () => {
        const result = await service.setSearchPath(tenant.schema);
        expect(dataSource.query).toHaveBeenCalledWith('SET search_path TO testSchema, public');
    });
})
