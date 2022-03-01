import { Nullable } from '../../../../../shared/domain/nullable';
import { AuthUser } from '../../../domain/auth-user.entity';
import { IUserRepository } from '../../../domain/user.repository';
import { AuthUserUuid } from '../../../domain/value-object/auth-user-uuid';
import { AuthUsername } from '../../../domain/value-object/auth-username';

export class FakeUserRepository implements IUserRepository {

    private repository: AuthUser[];

    constructor(repository: AuthUser[] = []) {
        this.repository = repository;
    }

    async findByUsername(username: AuthUsername): Promise<Nullable<AuthUser>> {
        return Promise.resolve(this.repository.find(user => user.username.value === username.value));
    }

    async findByUuid(uuid: AuthUserUuid): Promise<Nullable<AuthUser>> {
        return Promise.resolve(this.repository.find(user => user.uuid.value === uuid.value));
    }

    async save(user: AuthUser): Promise<void> {
        this.repository.push(user);
        return Promise.resolve();
    }
}