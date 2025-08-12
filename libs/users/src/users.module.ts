import { Module } from '@nestjs/common';
import { UserRepository } from './infrastructure/user.repository';
import { UserService } from './application/user.service';
import { TenancyModule } from '@erp-system/tenancy'
import { SharedTokenModule } from '@erp-system/shared-token';
import { SharedRbacModule } from '@erp-system/shared-rbac';
import { UserController } from './presentation/user.controller';

@Module({
    imports: [
        TenancyModule,
        SharedTokenModule,
        SharedRbacModule
    ],
    controllers: [UserController],
    providers: [UserRepository, UserService],
    exports: [UserService],
})
export class UsersModule {}
