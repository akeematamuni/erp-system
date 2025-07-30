import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { JwtPayload } from '@erp-system/shared-types';

@Injectable()
export class SharedTokenService {
    constructor(
        private readonly config: ConfigService,
        private readonly jwt: NestJwtService
    ) {}

    async generateAccessToken(payload: JwtPayload) {
        return await this.jwt.signAsync(payload);
    }

    async generateRefreshToken(payload: JwtPayload) {
        return await this.jwt.signAsync(
            payload, { 
                expiresIn: '24h', 
                secret: this.config.get('REFRESH_SECRET')
            }
        );
    }

    async verifyToken(token: string, refresh?: boolean) {
        if (refresh) {
            return await this.jwt.verifyAsync(
                token, 
                { secret: this.config.get('REFRESH_SECRET') }
            );
        }

        return await this.jwt.verifyAsync(token);
    }
}
