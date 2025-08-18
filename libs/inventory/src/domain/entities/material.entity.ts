import { 
    PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, 
    Column, Entity, Index, ManyToOne, JoinColumn, OneToMany
} from 'typeorm';
import { InvCategory } from './category.entity';
import { InvStock } from './stock.entity';
import { InvStockMovement } from './stock-movement.entity';

@Entity('inv_materials')
export class InvMaterial {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Index({ unique: true })
    @Column({ type: 'varchar', length: 16 })
    sku!: string;

    @Column({ type: 'varchar', length: 16 })
    name!: string;

    @Column({ type: 'varchar', length: 16, default: 'EA' })
    uom!: string;

    @Column({ type: 'boolean', default: true })
    isActive!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @Index()
    @Column({ type: 'uuid', nullable: false })
    categoryId!: string;

    @ManyToOne(() => InvCategory, (ivc) => ivc.materials)
    @JoinColumn({ name: 'categoryId'})
    category!: InvCategory;

    @OneToMany(() => InvStock, (ivs) => ivs.material)
    stocks!: InvStock[];

    @OneToMany(() => InvStockMovement, (ivsm) => ivsm.material)
    stockMovements!: InvStockMovement[];
}
// cont...
