import { 
    Entity, Column, PrimaryGeneratedColumn, 
    CreateDateColumn, UpdateDateColumn, OneToMany
 } from 'typeorm';
import { PublicUser } from './public-user.entity';

@Entity({ name: 'tenants', schema: 'public' })
export class Tenant {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', unique: true })
    name!: string;

    @Column({ name: 'schema_name', type: 'varchar', unique: true })
    schema!: string; 

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToMany(() => PublicUser, user => user.tenant)
    users!: PublicUser[];
}
