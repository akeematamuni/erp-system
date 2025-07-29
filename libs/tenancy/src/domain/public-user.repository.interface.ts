import { PublicUser } from "./public-user.entity";

export interface IPublicUserRepository {
    findPublicUserById(id: string): Promise<PublicUser | null>;
    findPublicUserByEmail(email: string): Promise<PublicUser | null>;
}
