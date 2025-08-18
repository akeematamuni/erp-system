import { 
    PrimaryGeneratedColumn, Column, CreateDateColumn,
    UpdateDateColumn, Entity, ManyToOne,
    JoinColumn, Index
} from 'typeorm';
import { InvMaterial } from './material.entity';
import { InvWarehouse } from './warehouse.entity';

export enum StockMovement {
    IN = 'IN',
    OUT = 'OUT',
    TRANSFER = 'TRANSFER'
}

@Entity('inv_stock_movements')
export class InvStockMovement {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'enum', enum: StockMovement })
    movementType!: StockMovement;

    @Column({ type: 'numeric', precision: 18, scale: 3 })
    quantity!: string;

    @Column({ type: 'varchar', length: 128, nullable: true })
    reason?: string;

    @Column({ type: 'varchar', length: 24, nullable: true })
    reference?: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @Index()
    @Column({ type: 'uuid', nullable: false })
    materialId!: string;

    @Index()
    @Column({ type: 'uuid', nullable: true })
    toWarehouseId?: string;

    @Index()
    @Column({ type: 'uuid', nullable: true })
    fromWarehouseId?: string;

    @ManyToOne(() => InvMaterial, (ivm) => ivm.stockMovements)
    @JoinColumn({ name: 'materialId' })
    material!: InvMaterial;

    @ManyToOne(() => InvWarehouse, (ivw) => ivw.fromMovements)
    @JoinColumn({ name: 'fromWarehouseId' })
    fromWarehouse?: InvWarehouse;

    @ManyToOne(() => InvWarehouse, (ivw) => ivw.toMovements)
    @JoinColumn({ name: 'toWarehouseId' })
    toWarehouse?: InvWarehouse;
}
