import { 
    PrimaryGeneratedColumn, Column, CreateDateColumn,
    UpdateDateColumn, Entity, ManyToOne,
    JoinColumn, Unique, Check
} from 'typeorm';
import { InvMaterial } from './material.entity';
import { InvWarehouse } from './warehouse.entity';

@Entity('inv_stocks')
@Unique(['material', 'warehouse'])
@Check(`"quantity" >= 0`)
export class InvStock {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'numeric', precision: 18, scale: 3, default: '0' })
    quantity!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @Column({ type: 'uuid' })
    materialId!: string;

    @Column({ type: 'uuid' })
    warehouseId!: string;

    @ManyToOne(() => InvMaterial, (ivm) => ivm.stocks, { nullable: false })
    @JoinColumn({ name: 'materialId' })
    material!: InvMaterial;
    
    @ManyToOne(() => InvWarehouse, (ivw) => ivw.stocks, { nullable: false })
    @JoinColumn({ name: 'warehouseId' })
    warehouse!: InvWarehouse;
}
