import { Nullable } from '../../../shared/domain/nullable';
import { AuthToken } from './auth-token.entity';
import { AuthTokenId } from './value-object/auth-token-id';
import { AuthUserUuid } from './value-object/auth-user-uuid';

export interface ITokenRepository {
    find(token: AuthTokenId): Promise<Nullable<AuthToken>>;
    findValidByUserUuid(uuid: AuthUserUuid): Promise<Nullable<AuthToken[]>>;
    save(token: AuthToken): Promise<void>;
    saveAll(tokens: AuthToken[]): Promise<void>;
}