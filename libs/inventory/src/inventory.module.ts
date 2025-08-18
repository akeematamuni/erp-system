import { Module } from '@nestjs/common';
import { InvCategoryRepository } from './infrastructure/category.repository';
import { InvWarehouseRepository} from './infrastructure/warehouse.repository';

@Module({
    controllers: [],
    providers: [
        InvCategoryRepository,
        InvWarehouseRepository
    ],
    exports: [
        InvCategoryRepository,
        InvWarehouseRepository
    ],
})
export class InventoryModule {}
