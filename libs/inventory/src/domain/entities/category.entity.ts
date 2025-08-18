import { 
    Entity, PrimaryGeneratedColumn, Column, Index,
    CreateDateColumn, UpdateDateColumn, OneToMany 
} from 'typeorm';
import { InvMaterial } from './material.entity';

@Entity('inv_categories')
export class InvCategory {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Index({ unique: true })
    @Column({ type: 'varchar', length: 64 })
    name!: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    description?: string;

    @Column({ type: 'boolean', default: true })
    isActive!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToMany(() => InvMaterial, (ivm) => ivm.category)
    materials!: InvMaterial[];
}
