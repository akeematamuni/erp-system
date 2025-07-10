import { Module } from '@nestjs/common';
import { TenantRepository } from './infrastructure/tenant.repository';
import { TenantService } from './application/tenant.service';

@Module({
    providers: [TenantRepository, TenantService],
    exports: [TenantService],
})
export class TenancyModule {}

// cont. step 5+ Log, Test, Doc