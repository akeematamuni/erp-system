import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { ErpSystemSharedConfigModule } from '@erp-system/shared-config';
import { SharedTokenService } from './application/shared-token.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtGuard } from './guard/auth.guard';

@Module({
    imports: [
        NestJwtModule.registerAsync({
            imports: [ErpSystemSharedConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>('LOGIN_SECRET'),
                signOptions: { expiresIn: '10m' }
            })
        })
    ],
    providers: [
        SharedTokenService, JwtStrategy, JwtGuard
    ],
    exports: [
        SharedTokenService, JwtStrategy, JwtGuard
    ],
})
export class SharedTokenModule {}
