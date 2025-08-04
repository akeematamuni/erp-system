import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ErpSystemSharedConfigModule } from '@erp-system/shared-config';
import { SharedDatabaseModule } from '@erp-system/shared-database';
import { SharedLoggerModule } from '@erp-system/shared-logger';
import { TenancyModule } from '@erp-system/tenancy';
import { TenantMiddleware } from '@erp-system/tenancy';
import { SharedAuthModule } from '@erp-system/shared-auth';
import { SharedTokenModule } from '@erp-system/shared-token';
import { SharedRbacModule } from '@erp-system/shared-rbac';

@Module({
    imports: [
        ErpSystemSharedConfigModule,
        SharedLoggerModule.forRoot(),
        SharedDatabaseModule,
        TenancyModule,
        SharedAuthModule,
        SharedTokenModule,
        SharedRbacModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule implements NestModule{
    // Apply tenant middleware on all routes
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(TenantMiddleware)
        .exclude(
            { path: 'api/v1/auth/register', method: RequestMethod.POST },
            { path: 'api/v1/auth/login', method: RequestMethod.POST }
        )
        .forRoutes('api/v1/*path');
    }
}
