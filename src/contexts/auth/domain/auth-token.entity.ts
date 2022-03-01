import { AuthDate } from './value-object/auth-date';
import { AuthTokenStatus, TokenStatus } from './value-object/auth-token-status';
import { AuthTokenId } from './value-object/auth-token-id';
import { AuthUserUuid } from './value-object/auth-user-uuid';
import * as crypto from 'crypto';
import { AggregateRoot } from '../../../shared/domain/aggregateroot.interface';

export class AuthToken extends AggregateRoot {
    toPrimitives() {
        return {
            id: this.id.value,
            user: this.user.value,
            status: this.status.value,
            createdAt: this.createdAt.value,
            updatedAt: this.updatedAt.value
        }
    }

    static fromPrimitives(payload: {
        id: string,
        user: string,
        status: TokenStatus,
        createdAt: string,
        updatedAt: string,
    }) {
        return new AuthToken(
            new AuthTokenId(payload.id),
            new AuthUserUuid(payload.user),
            new AuthTokenStatus(payload.status),
            new AuthDate(payload.createdAt),
            new AuthDate(payload.updatedAt)
        )
    }
    private constructor(public readonly id: AuthTokenId,
        public readonly user: AuthUserUuid,
        public readonly status: AuthTokenStatus,
        public readonly createdAt: AuthDate,
        public readonly updatedAt: AuthDate) {
        super()
    }

    isValid(): boolean {
        return this.status.valid();
    }

    isExpired(): boolean {
        return this.status.expired();
    }
    invalidate() {
        return new AuthToken(this.id, this.user, new AuthTokenStatus(TokenStatus.INVALID), this.createdAt, AuthDate.now());
    }
    use() {
        return new AuthToken(this.id, this.user, new AuthTokenStatus(TokenStatus.USED), this.createdAt, AuthDate.now());
    }
    expire() {
        return new AuthToken(this.id, this.user, new AuthTokenStatus(TokenStatus.EXPIRED), this.createdAt, AuthDate.now());
    }

    static create(uuid: AuthTokenId, user: AuthUserUuid) {
        return new AuthToken(uuid, user, new AuthTokenStatus(TokenStatus.VALID), AuthDate.now(), AuthDate.now());
    }

    static randomid() {
        let res = '';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charLen = chars.length;

        for (var i = 0; i < 50; i++) {
            res += chars.charAt(crypto.randomInt(charLen));
        }

        return new AuthTokenId(res);
    }
}