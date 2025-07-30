import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { ErpSystemSharedConfigModule } from '@erp-system/shared-config';
import { SharedTokenService } from './application/shared-token.service';

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
    providers: [SharedTokenService],
    exports: [SharedTokenService],
})
export class SharedTokenModule {}
