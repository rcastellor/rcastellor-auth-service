import { AuthDate } from './value-object/auth-date';
import { AuthTokenStatus, TokenStatus } from './value-object/auth-token-status';
import { AuthTokenId } from './value-object/auth-token-id';
import { AuthUserUuid } from './value-object/auth-user-uuid';
import * as crypto from 'crypto';

export class AuthToken {
    private constructor(public readonly uuid: AuthTokenId,
        public readonly user: AuthUserUuid,
        public readonly status: AuthTokenStatus,
        public readonly createdAt: AuthDate,
        public readonly updatedAt: AuthDate) { }

    isValid(): boolean {
        return this.status.valid();
    }

    isExpired(): boolean {
        return this.status.expired();
    }
    invalidate() {
        return new AuthToken(this.uuid, this.user, new AuthTokenStatus(TokenStatus.INVALID), this.createdAt, AuthDate.now());
    }
    use() {
        return new AuthToken(this.uuid, this.user, new AuthTokenStatus(TokenStatus.USED), this.createdAt, AuthDate.now());
    }
    expire() {
        return new AuthToken(this.uuid, this.user, new AuthTokenStatus(TokenStatus.EXPIRED), this.createdAt, AuthDate.now());
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