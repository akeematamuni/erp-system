import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from '../domain/user.entity';
import { IUserRepository } from '../domain/user.repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
    constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

    async save(user: User): Promise<User> {
        return await this.repo.save(user);
    }

    async findById(id: string): Promise<User | null> {
        return await this.repo.findOne({ where: { id } });
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.repo.findOne({ where: { email } });
    }

    async doesUserExist(email: string): Promise<boolean> {
        return await this.repo.count({ where: { email } }) > 0;
    }

    async findByDepartment(department: string): Promise<User[]> {
        return await this.repo.find({ where: { department } });
    }
}
