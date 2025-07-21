import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { RegisterTenantDto } from './dto/register-tenant.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async registerTenant(@Body(ValidationPipe) dto: RegisterTenantDto) {
        return await this.authService.registerTenant(dto);
    }
}
