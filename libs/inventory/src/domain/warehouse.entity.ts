import { 
    PrimaryGeneratedColumn, Column, CreateDateColumn,
    UpdateDateColumn, Index, Entity, OneToMany
} from 'typeorm';
import { InvStock } from './stock.entity';
import { InvStockMovement } from './stock-movement.entity';

@Entity('inv_warehouses')
export class InvWarehouse {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Index({ unique: true })
    @Column({ type: 'varchar' })
    code!: string;

    @Column({ type: 'varchar' })
    name!: string;

    @Column({ type: 'varchar', nullable: true })
    address?: string;

    @Column({ type: 'boolean', default: true })
    isActive!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToMany(() => InvStock, (ivs) => ivs.warehouse)
    stocks!: InvStock[];

    @OneToMany(() => InvStockMovement, (ivsm) => ivsm.fromWarehouse)
    fromMovements!: InvStockMovement[];

    @OneToMany(() => InvStockMovement, (ivsm) => ivsm.toWarehouse)
    toMovements!: InvStockMovement[];
}
