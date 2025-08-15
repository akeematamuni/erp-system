import { 
    Entity, PrimaryGeneratedColumn, Column, Index,
    CreateDateColumn, UpdateDateColumn, JoinColumn, OneToMany 
} from 'typeorm';
import { InvMaterial } from './material.entity';

@Entity('inv_categories')
export class InvCategory {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Index({ unique: true })
    @Column({ type: 'varchar' })
    name!: string;

    @Column({ type: 'varchar', nullable: true })
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
