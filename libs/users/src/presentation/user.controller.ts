import { Body, Controller, Post, Req, UseGuards, ValidationPipe, Ip } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserResponseDto } from './dto/create-user-res.dto';
import { UserService } from '../application/user.service';
import { JwtGuard } from '@erp-system/shared-token';
import { Roles, RolesGuard } from '@erp-system/shared-rbac';
import { RoleType } from '@erp-system/shared-types';
import { Request } from 'express';
import { plainToInstance } from 'class-transformer';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('add-new-user')
    @Roles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
    @UseGuards(JwtGuard, RolesGuard)
    async createNewUser(
        @Ip() ip: string, @Req() req: Request,
        @Body(ValidationPipe) createUserDto: CreateUserDto
    ) {
        const adminUser = req.user as {
            id: string, role: string, orgId: string
        }

        const newUserDto = {
            ...createUserDto,
            tenantId: adminUser.orgId,
            createdBy: adminUser.id
        }

        const newUserObj = await this.userService.adminCreateNewUser(newUserDto);

        return plainToInstance(
            CreateUserResponseDto,
            newUserObj,
            { excludeExtraneousValues: true }
        );
    }
}
