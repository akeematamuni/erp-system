import { InvCategory } from '../entities/category.entity';

export interface ICategoryRepository {
    save(category: InvCategory, schema: string): Promise<InvCategory>;
    findByName(name: string, schema: string): Promise<InvCategory | null>;
    findById(id: string, schema: string): Promise<InvCategory | null>;
    findAll(schema: string): Promise<InvCategory[]>;
    // deleteByName(name: string, schema: string): Promise<void>;
    // deleteById(id: string, schema: string): Promise<void>;
}
