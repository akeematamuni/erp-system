import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Tenant } from '../domain/tenant.entity';
import { ITenantRepository } from '../domain/tenant.repository.interface';

// cont step 5. Tenant Repository (Infrastructure Layer)
@Injectable()
export class TenantRepository implements ITenantRepository {
    constructor(private readonly dataSource: DataSource) {}

    async findById(id: string) {
        return this.dataSource.getRepository(Tenant).findOne({ where: { id } });
    }
}
