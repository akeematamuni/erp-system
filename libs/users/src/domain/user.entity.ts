import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryGeneratedColumn
} from 'typeorm';
import { RoleType } from '@erp-system/shared-types';

@Entity('tenant_users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar' })
    fullname!: string;

    @Column({ type: 'enum', enum: RoleType })
    role!: RoleType;

    @Column({ type: 'varchar', nullable: true })
    department?: string;

    @Column({ type: 'varchar', nullable: true })
    createdBy?: string;

    @Column({ type: 'varchar', unique: true })
    email!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
