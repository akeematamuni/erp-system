import { Expose } from 'class-transformer';
import { RoleType } from '@erp-system/shared-types';

export class CreateUserResponseDto {
    @Expose()
    id!: string;

    @Expose()
    fullname!: string;   

    @Expose()
    department?: string;

    @Expose()
    role!: RoleType; 

    @Expose()
    email!: string;

    @Expose()
    password!: string;

    @Expose()
    createdBy?: string;
}
