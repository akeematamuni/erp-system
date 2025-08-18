import { InvWarehouse } from '../entities/warehouse.entity';

export interface IWarehouseRepository {
    save(warehouse: InvWarehouse, schema: string): Promise<InvWarehouse>;
    findAll(schema: string): Promise<InvWarehouse[]>;
    findById(id: string, schema: string): Promise<InvWarehouse | null>;
    findByCode(code: string, schema: string): Promise<InvWarehouse | null>;
}
