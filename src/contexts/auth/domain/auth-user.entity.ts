import { AggregateRoot } from '../../../shared/domain/aggregateroot.interface';
import { AuthUsername } from './value-object/auth-username';
import { AuthPassword } from './value-object/auth-password';
import { AuthEmail } from './value-object/auth-email';
import { AuthUserUuid } from './value-object/auth-user-uuid';
import { AuthUserStatus, UserStatus } from './value-object/auth-user-status';

export class AuthUser extends AggregateRoot {

    private constructor(public readonly uuid: AuthUserUuid,
        public readonly username: AuthUsername,
        public readonly password: AuthPassword,
        public readonly email: AuthEmail,
        public readonly status: AuthUserStatus) {
        super();
    }

    static create(payload: {
        uuid: AuthUserUuid,
        username: AuthUsername,
        password: AuthPassword,
        email: AuthEmail,
        status: AuthUserStatus
    }) {
        return new AuthUser(payload.uuid,
            payload.username,
            payload.password,
            payload.email,
            payload.status
        );
    }

    static fromPrimitives(payload: {
        uuid: string,
        username: string,
        password: string,
        email: string,
        status: UserStatus
    }) {
        return new AuthUser(
            new AuthUserUuid(payload.uuid),
            new AuthUsername(payload.username),
            new AuthPassword(payload.password),
            new AuthEmail(payload.email),
            new AuthUserStatus(payload.status),
        );
    }

    toPrimitives() {
        return {
            uuid: this.uuid.value,
            username: this.username.value,
            password: this.password.value,
            email: this.email.value,
            status: this.status.value,
        }
    }
}