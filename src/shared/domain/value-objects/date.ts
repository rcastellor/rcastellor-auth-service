export abstract class DateValueObject {

    readonly value: Date;
    constructor(value: Date) {
        this.value = value;
    }

    static fromString(date: string) {
        return new Date();
    }


    toString() {
        return this.value;
    }
}