import { StringValueObject } from '../../../../shared/domain/value-objects/string';

export class AuthTokenId extends StringValueObject {
    constructor(value: string) {
        super(value);

        if (!value || value === '') {
            throw new Error('Empty id value');
        }
    }
}