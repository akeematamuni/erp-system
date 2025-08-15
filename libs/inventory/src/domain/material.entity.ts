import { 
    PrimaryGeneratedColumn, UpdateDateColumn, 
    CreateDateColumn, Column, Entity, Index, ManyToOne, JoinColumn,
    OneToMany
} from 'typeorm';
import { InvCategory } from './category.entity';
import { InvStock } from './stock.entity';
import { InvStockMovement } from './stock-movement.entity';

@Entity('inv_materials')
export class InvMaterial {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Index({ unique: true })
    @Column({ type: 'varchar' })
    sku!: string;

    @Column({ type: 'varchar' })
    name!: string;

    @Column({ type: 'varchar', default: 'EA' })
    uom!: string;

    @Column({ type: 'boolean', default: true })
    isActive!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @Column({ type: 'uuid' })
    categoryId!: string;

    @ManyToOne(() => InvCategory, (ivc) => ivc.materials, { nullable: false })
    @JoinColumn({ name: 'categoryId'})
    category!: InvCategory;

    @OneToMany(() => InvStock, (ivs) => ivs.material)
    stocks!: InvStock[];

    @OneToMany(() => InvStockMovement, (ivsm) => ivsm.material)
    stockMovements!: InvStockMovement[];
}
// cont...
