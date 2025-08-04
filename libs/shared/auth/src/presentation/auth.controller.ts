import { Body, Controller, Post, Get, ValidationPipe, UseGuards } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { RegisterTenantDto } from './dto/register-tenant.dto';
import { RegResponseDto } from './dto/register-response.dto';
import { plainToInstance, instanceToPlain } from 'class-transformer';
import { LoginUserDto } from './dto/login-tenant.dto';
import { JwtGuard } from '@erp-system/shared-token';
import { Roles, RolesGuard } from '@erp-system/shared-rbac';
import { RoleType } from '@erp-system/shared-types';

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


@Controller()
export class ExampleController {
    constructor(private readonly authService: AuthService) {}

    @Get('example/link')
    @Roles(RoleType.SUPER_ADMIN)
    @UseGuards(JwtGuard, RolesGuard)
    async exampleLink() {
        return '<h2>This is an example link... bye...</h2>';
    }
}
