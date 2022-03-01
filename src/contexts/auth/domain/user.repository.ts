import { Nullable } from '../../../shared/domain/nullable';
import { AuthUser } from './auth-user.entity';
import { AuthUserUuid } from './value-object/auth-user-uuid';
import { AuthUsername } from './value-object/auth-username';

export interface IUserRepository {
    findByUuid(uuid: AuthUserUuid): Promise<Nullable<AuthUser>>;
    findByUsername(username: AuthUsername): Promise<Nullable<AuthUser>>;
    save(user: AuthUser): Promise<void>;
}