import { StringValueObject } from '../../../../shared/domain/value-objects/string';

export class AuthDate extends StringValueObject {

    static now() {
        return new AuthDate(new Date().toUTCString())
    }
}