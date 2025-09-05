import { Module } from '@nestjs/common';
import { InvCategoryRepository } from './infrastructure/category.repository';
import { InvWarehouseRepository} from './infrastructure/warehouse.repository';
import { InvMaterialRepoitory } from './infrastructure/material.repository';

@Module({
    controllers: [],
    providers: [
        InvCategoryRepository,
        InvWarehouseRepository,
        InvMaterialRepoitory
    ],
    exports: [
        InvCategoryRepository,
        InvWarehouseRepository,
        InvMaterialRepoitory
    ],
})
export class InventoryModule {}
