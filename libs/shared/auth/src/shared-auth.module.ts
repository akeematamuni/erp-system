import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/user.entity';
import { UserRepository } from './infrastructure/user.repository';
import { AuthService } from './application/auth.service';
import { AuthController } from './presentation/auth.controller';
import { TenancyModule } from '@erp-system/tenancy';

@Module({
    imports: [TypeOrmModule.forFeature([User]), TenancyModule],
    providers: [UserRepository, AuthService],
    controllers: [AuthController],
    exports: [],
})
export class SharedAuthModule {}
// wiring up...