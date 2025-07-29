import { Module } from '@nestjs/common';
import { CentralRepository } from './infrastructure/tenant.repository';
import { TenantService } from './application/tenant.service';

@Module({
    providers: [CentralRepository, TenantService],
    exports: [TenantService],
})
export class TenancyModule {}

// cont. step 5+ Log, Test, Doc