import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tenants', schema: 'public' })
export class Tenant {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name!: string;

    @Column({ name: 'schema_name' })
    schema!: string; 
}
