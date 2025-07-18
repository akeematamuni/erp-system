import { IsNotEmpty, IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterTenantDto {
    @IsString()
    @IsNotEmpty()
    enterpriseName!: string;

    @IsString()
    @IsNotEmpty()
    fullname!: string;

    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(8)
    password!: string;
}
