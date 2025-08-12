import { ConflictException, Inject, Injectable, InternalServerErrorException, LoggerService } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { LoggerToken, CustomLoggerService } from '@erp-system/shared-logger';
import { UserRepository } from '../infrastructure/user.repository';
import { User } from '../domain/user.entity';
import { TenantService } from '@erp-system/tenancy';
import { CreateUserDto2 } from '../presentation/dto/create-user.dto';

@Injectable()
export class UserService {
    private readonly logger: LoggerService;
    private userRepo: UserRepository | undefined;

    constructor(
        @Inject(LoggerToken) private readonly base: CustomLoggerService,
        private readonly tenantService: TenantService,
    ) {
        this.logger = base.addContext(UserService.name);
    }

    async addNewTenantUser(tenantDataSource: DataSource, user: User) {
        try {
            this.userRepo = new UserRepository(tenantDataSource);
            const exist = await this.userRepo.doesUserExist(user.email);

            if (exist) {
                this.logger.warn(`User "${user.email}" already exist...`);
                throw new ConflictException('User already exists...');
            }

            return await this.userRepo.save(user);

        } catch (error) {
            this.logger.error(`There was an error adding user "${user.email}\n${error}"`);
            throw new InternalServerErrorException('Error occured, please retry...');
        }
    }

    async findTenantUserByEmail(tenantDataSource: DataSource, email: string) {
        try {
            this.userRepo = new UserRepository(tenantDataSource)
            return await this.userRepo.findByEmail(email);

        } catch (error) {
            this.logger.error(`Error occured while finding user "${email}"`);
            throw new InternalServerErrorException('Error occured, please retry...');
        }
    }

    async adminCreateNewUser(createUserDto: CreateUserDto2) {
        // try {
        //     // check if user exists on public and tenant
        //     const existsOnPublic = await this.tenantService.resolvePublicUserEmail(
        //         createUserDto.email
        //     );

        //     const existOnTenant = await this.
        // } catch (error) {
            
        // }
    }
}
