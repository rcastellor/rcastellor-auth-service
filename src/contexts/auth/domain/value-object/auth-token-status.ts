import { EnumValueObject } from '../../../../shared/domain/value-objects/enum';

export enum TokenStatus {
    EXPIRED = 'EXPIRED',
    USED = 'USED',
    VALID = 'VALID',
    INVALID = 'INVALID',
}

export class AuthTokenStatus extends EnumValueObject<TokenStatus> {
    constructor(status: TokenStatus) {
        super(status, [
            TokenStatus.EXPIRED,
            TokenStatus.USED,
            TokenStatus.VALID,
            TokenStatus.INVALID
        ]);
    }

    valid(): boolean {
        return this.value === TokenStatus.VALID;
    }

    expired(): boolean {
        return this.value === TokenStatus.EXPIRED;
    }
}