import { Nullable } from '../../../shared/domain/nullable';
import { AuthUser } from './auth-user.entity';

export interface IUserRepository {
    findByUuid(uuid: string): Promise<Nullable<AuthUser>>;
    findByUsername(username: string): Promise<Nullable<AuthUser>>;
    save(user: AuthUser): void;
}