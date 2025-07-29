import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { RegisterTenantDto } from './dto/register-tenant.dto';
import { RegResponseDto } from './dto/register-response.dto';
import { plainToInstance, instanceToPlain } from 'class-transformer';
import { LoginUserDto } from './dto/login-tenant.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async registerTenant(@Body(ValidationPipe) dto: RegisterTenantDto) {
        const responce = await this.authService.registerTenant(dto);
        return plainToInstance(
            RegResponseDto, 
            instanceToPlain(responce), 
            { excludeExtraneousValues: true }
        );
    }

    @Post('login')
    async loginUser(@Body(ValidationPipe) dto: LoginUserDto) {
        return await this.authService.loginUser(dto);
    }
}
