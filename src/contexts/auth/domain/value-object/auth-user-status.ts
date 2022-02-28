import { EnumValueObject } from '../../../../shared/domain/value-objects/enum';

export enum UserStatus {
    ACTIVE = 'ACTIVE',
    DISABLED = 'DISABLED'
}

export class AuthUserStatus extends EnumValueObject<UserStatus> {

    constructor(userStatus: UserStatus) {
        super(userStatus, [
            UserStatus.ACTIVE,
            UserStatus.DISABLED
        ]);
    }
}