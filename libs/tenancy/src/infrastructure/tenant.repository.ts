import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Tenant } from '../domain/tenant.entity';

// cont step 5. Tenant Repository (Infrastructure Layer)
@Injectable()
export class TenantRepository {
    constructor(private readonly dataSource: DataSource) {}

    async findById(id: string): Promise<Tenant|null> {
        return this.dataSource.getRepository(Tenant).findOne({ where: { id } });
    }
}
