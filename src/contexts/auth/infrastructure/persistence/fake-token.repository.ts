import { Nullable } from '../../../../shared/domain/nullable';
import { AuthToken } from '../../domain/auth-token.entity';
import { ITokenRepository } from '../../domain/token.repository';
import { AuthTokenId } from '../../domain/value-object/auth-token-id';
import { AuthUserUuid } from '../../domain/value-object/auth-user-uuid';


export class FakeTokenRepository implements ITokenRepository {

    private repository: AuthToken[];

    constructor(repository: AuthToken[] = []) {
        this.repository = repository;
    }

    find(token: AuthTokenId): Promise<Nullable<AuthToken>> {
        return Promise.resolve(this.repository.find(t => t.uuid.value == token.value));
    }
    findValidByUserUuid(uuid: AuthUserUuid): Promise<Nullable<AuthToken[]>> {
        return Promise.resolve(this.repository.filter(t => t.user.value === uuid.value && t.isValid()));
    }
    save(token: AuthToken): Promise<void> {
        this.repository = [...this.repository.filter(t => t.uuid.value !== token.uuid.value), token];
        return Promise.resolve();
    }
    saveAll(tokens: AuthToken[]): Promise<void> {
        this.repository = [
            ...this.repository.filter(t => !tokens.find(t1 => t.uuid.value === t1.uuid.value)),
            ...tokens
        ];
        return Promise.resolve();
    }

}