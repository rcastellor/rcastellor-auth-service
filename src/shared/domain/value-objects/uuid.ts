import { v4, validate } from 'uuid';
import { InvalidArgumentError } from './invalid-argument-error';

export class Uuid {

    readonly value: string;

    constructor(value: string) {
        this.guard(value);

        this.value = value;
    }

    private guard(id: string) {
        if(!validate(id)) {
            throw new InvalidArgumentError(`<${this.constructor.name}> does not allow the value <${id}>`);
        }        
    }

    static random(): Uuid {
        return new Uuid(v4())
    }

    toString(): string {
        return this.value;
    }
}