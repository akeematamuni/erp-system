import { User } from './user.entity';

export interface IUserRepository {
    save(user: User): Promise<User>;
    userExist(email: string): Promise<boolean>;
    findById(id: string): Promise<User|null>;
    findByEmail(email: string): Promise<User|null>;
    findByDepartment(department: string): Promise<User[]>;
}
