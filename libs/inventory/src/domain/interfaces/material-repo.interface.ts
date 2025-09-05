import { InvMaterial } from "../entities/material.entity";

export interface IMaterialRepository {
    save(material: InvMaterial, schema: string): Promise<InvMaterial>;
    findBySku(sku: string, schema: string): Promise<InvMaterial | null>;
    findAll(schema: string): Promise<InvMaterial[]>;
}
