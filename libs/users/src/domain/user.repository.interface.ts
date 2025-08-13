import { User } from './user.entity';

export interface IUserRepository {
    save(user: User, schema: string): Promise<User>;
    findById(id: string, schema: string): Promise<User|null>;
    findByEmail(email: string, schema: string): Promise<User|null>;
    doesUserExist(email: string, schema: string): Promise<boolean>;
    findByDepartment(department: string, schema: string): Promise<User[]>;
}
