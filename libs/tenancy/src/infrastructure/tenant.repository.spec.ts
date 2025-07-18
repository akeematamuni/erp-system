// import { DataSource, Repository } from 'typeorm';
// import { TenantRepository } from './tenant.repository';
// import { Tenant } from '../domain/tenant.entity';
// import { LoggerToken, CustomLoggerService } from '@erp-system/shared-logger';

// describe('TenantRepository', () => {
//     const tenant = { id: 'testId', name: 'testName', schema: 'testSchema' } as Tenant;
//     const repo = { findOne: jest.fn() } as unknown as Repository<Tenant>;
//     const dataSource = { 
//         getRepository: jest.fn().mockReturnValue(repo)
//     } as unknown as DataSource;

//     const baseLogger = 

//     let repository: TenantRepository;

//     beforeEach(() => {
//         repository = new TenantRepository(dataSource);
//         jest.clearAllMocks();
//     });

//     it('return tenant when found', async () => {
//         repo.findOne = jest.fn().mockResolvedValue(tenant);
//         const result = await repository.findById('testId');

//         expect(dataSource.getRepository).toHaveBeenCalledWith(Tenant);
//         expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 'testId' } });
//         expect(result).toEqual(tenant);
//     });

//     it('return null when not found', async () => {
//         repo.findOne = jest.fn().mockResolvedValue(null);
//         const result = await repository.findById('testId');
//         expect(result).toBeNull();
//     });
// })
