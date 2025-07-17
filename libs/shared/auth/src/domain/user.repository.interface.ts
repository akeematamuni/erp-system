import { User } from './user.entity';

export interface IUserRepository {
    save(user: User): Promise<User>;
    findById(id: string): Promise<User|null>;
    findByEmail(email: string): Promise<User|null>;
    doesUserExist(email: string): Promise<boolean>;
    findByDepartment(department: string): Promise<User[]>;
}
