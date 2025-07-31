import { Expose } from 'class-transformer';
import { RoleType } from '@erp-system/shared-types';

export class RegResponseDto {
    @Expose()
    id!: string;

    @Expose()
    tenantId!: string;

    @Expose()
    fullname!: string;

    @Expose()
    email!: string;

    @Expose()
    role!: RoleType;

    @Expose()
    department?: string;

    @Expose()
    createdBy?: string;

    @Expose()
    isActive!: boolean;
}
