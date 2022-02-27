import { Nullable } from '../../../shared/domain/nullable';
import { AuthUser } from '../domain/auth-user.entity';
import { IUserRepository } from '../domain/user.repository';

export class FakeUserRepository implements IUserRepository {

    private repository: AuthUser[];

    constructor(repository: AuthUser[] = []) {
        this.repository = repository;
    }

    async findByUsername(username: string): Promise<Nullable<AuthUser>> {
        return Promise.resolve(this.repository.find(user => user.username.value === username));
    }

    async findByUuid(uuid: string): Promise<Nullable<AuthUser>> {
        return Promise.resolve(this.repository.find(user => user.uuid.value === uuid));
    }

    async save(user: AuthUser): Promise<void> {
        Promise.resolve(this.repository.push(user));
    }
}