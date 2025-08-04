import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/user.entity';
import { UserRepository } from './infrastructure/user.repository';
import { AuthService } from './application/auth.service';
import { AuthController } from './presentation/auth.controller';
import { ExampleController } from './presentation/auth.controller';
import { TenancyModule } from '@erp-system/tenancy';
import { SharedTokenModule } from '@erp-system/shared-token';
import { SharedRbacModule } from '@erp-system/shared-rbac';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]), 
        TenancyModule,
        SharedTokenModule,
        SharedRbacModule
    ],
    providers: [UserRepository, AuthService],
    controllers: [AuthController, ExampleController],
    exports: [],
})
export class SharedAuthModule {}
// wiring up...