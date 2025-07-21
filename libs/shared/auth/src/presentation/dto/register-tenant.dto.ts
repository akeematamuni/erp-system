import { IsNotEmpty, IsEmail, IsString, MinLength } from 'class-validator';
import { LoginUserDto } from './login-tenant.dto';

export class RegisterTenantDto extends LoginUserDto {
    @IsString()
    @IsNotEmpty()
    enterpriseName!: string;

    @IsString()
    @IsNotEmpty()
    fullName!: string;
}
