import { 
    Entity, Column, PrimaryGeneratedColumn, 
    CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn 
} from 'typeorm';
import { Tenant } from './tenant.entity';

// Holds all users in database linking them to respective tenants
@Entity({ name: 'users', schema: 'public' })
export class PublicUser {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar' })
    fullname!: string;

    @Column({ type: 'varchar', unique: true })
    email!: string;

    @Column({ type: 'varchar' })
    password!: string;

    @Column({ type: 'boolean', default: true })
    isActive?: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @Column({ type: 'uuid' })
    tenantId!: string;

    @ManyToOne(() => Tenant, tenant => tenant.users, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'tenantId' })
    tenant!: Tenant;
}
