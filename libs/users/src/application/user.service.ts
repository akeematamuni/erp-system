import { ConflictException, Inject, Injectable, InternalServerErrorException, LoggerService } from '@nestjs/common';
import { LoggerToken, CustomLoggerService } from '@erp-system/shared-logger';
import { UserRepository } from '../infrastructure/user.repository';
import { User } from '../domain/user.entity';
import { TenantService } from '@erp-system/tenancy';
import { CreateUserDto2 } from '../presentation/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    private readonly logger: LoggerService;

    constructor(
        @Inject(LoggerToken) private readonly base: CustomLoggerService,
        private readonly tenantService: TenantService,
        private readonly userRepo: UserRepository
    ) {
        this.logger = base.addContext(UserService.name);
    }

    async addNewTenantUser(user: User, tenantSchema: string) {
        try {
            const exist = await this.userRepo.doesUserExist(user.email, tenantSchema);

            if (exist) {
                this.logger.warn(`User "${user.email}" already exist...`);
                throw new ConflictException('User already exists...');
            }

            return await this.userRepo.save(user, tenantSchema);

        } catch (error) {
            if (error instanceof ConflictException) throw error;
            throw new InternalServerErrorException('Error occured, please retry...');
        }
    }

    async findTenantUserByEmail(email: string, tenantSchema: string) {
        try {
            return await this.userRepo.findByEmail(email, tenantSchema);
        } catch (error) {
            throw new InternalServerErrorException('Error occured, please retry...');
        }
    }

    async adminCreateNewUser(createUserDto: CreateUserDto2) {
        // hash password
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

        try {
            // create user on on public schema
            const centralUser = await this.tenantService.registerPublicUser(
                createUserDto.fullname,
                createUserDto.email,
                hashedPassword,
                createUserDto.tenantId 
            );

            if (!centralUser) throw new Error();

            // create user on tenant schema
            const tenantUser = new User();
            tenantUser.id = centralUser.id;
            tenantUser.fullname = createUserDto.fullname;
            tenantUser.email = createUserDto.email;
            tenantUser.role = createUserDto.role;
            tenantUser.department = createUserDto.department;
            tenantUser.createdBy = createUserDto.createdBy;

            const tenantSchema = centralUser.tenant.schema;
            const newTenantUser = await this.addNewTenantUser(tenantUser, tenantSchema);

            return { ...newTenantUser, password: createUserDto.password };

        } catch (error) {
            throw error;
        }
    }
}
