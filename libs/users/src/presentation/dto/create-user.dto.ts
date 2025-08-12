import { IsString, IsEmail, MinLength, IsNotEmpty, IsEnum } from 'class-validator';
import { RoleType } from '@erp-system/shared-types';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    fullname!: string;
    
    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @MinLength(8)
    password!: string;

    @IsEnum(RoleType, {message: 'Please choose a valid role'})
    role!: RoleType;

    @IsString()
    @IsNotEmpty()
    department!: string;
}

export class CreateUserDto2 extends CreateUserDto {
    @IsString()
    @IsNotEmpty()
    tenantId!: string;

    @IsString()
    @IsNotEmpty()
    createdBy!: string;
}
