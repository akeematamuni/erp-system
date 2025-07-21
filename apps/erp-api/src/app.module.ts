import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './presentation/app.controller';
import { AppService } from './application/app.service';
import { ErpSystemSharedConfigModule } from '@erp-system/shared-config';
import { SharedDatabaseModule } from '@erp-system/shared-database';
import { SharedLoggerModule } from '@erp-system/shared-logger';
import { TenancyModule } from '@erp-system/tenancy';
import { TenantMiddleware } from '@erp-system/tenancy';

@Module({
    imports: [
        ErpSystemSharedConfigModule,
        SharedLoggerModule.forRoot(),
        SharedDatabaseModule,
        TenancyModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule{
    // Apply tenant middleware on all routes
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(TenantMiddleware)
        .exclude(
            { path: 'auth/register', method: RequestMethod.POST },
            { path: 'auth/login', method: RequestMethod.POST }
        )
        .forRoutes('*');
    }
}
