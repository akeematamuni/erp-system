import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ErpSystemSharedConfigModule } from '@erp-system/shared-config';

@Module({
    imports: [
        ErpSystemSharedConfigModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
