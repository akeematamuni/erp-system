import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryGeneratedColumn
} from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    fullname!: string;

    @Column()
    role!: string;

    @Column({ nullable: true })
    department!: string;

    @Column({ nullable: true })
    createdBy!: string;

    @Column({ default: true })
    isActive!: boolean;

    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
