import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/user.entity';
import { UserRepositoryToken } from './user.repository.token';
import { UserRepository } from './infrastructure/user.repository';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [{ provide: UserRepositoryToken, useClass: UserRepository }],
    exports: [UserRepositoryToken],
})
export class SharedAuthModule {}
// wiring up...