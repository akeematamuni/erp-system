import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './presentation/app.controller';
import { AppService } from './application/app.service';
import { ErpSystemSharedConfigModule } from '@erp-system/shared-config';
import { SharedDatabaseModule } from '@erp-system/shared-database';
import { TenancyModule } from '@erp-system/tenancy';
import { TenantMiddleware } from '@erp-system/tenancy';

@Module({
    imports: [
        ErpSystemSharedConfigModule,
        SharedDatabaseModule,
        TenancyModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule{
    // Apply tenant middleware on all routes
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(TenantMiddleware).forRoutes('*'); // Reg. and login to be excluded
    }
}
