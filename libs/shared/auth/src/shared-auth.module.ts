import { Module } from '@nestjs/common';
import { AuthService } from './application/auth.service';
import { AuthController } from './presentation/auth.controller';
import { ExampleController } from './presentation/auth.controller';
import { TenancyModule } from '@erp-system/tenancy';
import { SharedTokenModule } from '@erp-system/shared-token';
import { SharedRbacModule } from '@erp-system/shared-rbac';
import { UsersModule } from '@erp-system/users';

@Module({
    imports: [
        UsersModule, 
        TenancyModule,
        SharedTokenModule,
        SharedRbacModule
    ],
    providers: [AuthService],
    controllers: [AuthController, ExampleController],
    exports: [],
})
export class SharedAuthModule {}
// wiring up...