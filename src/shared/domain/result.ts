export class Result {
    private constructor(public readonly result: boolean,
        public readonly message: string,
        public readonly data: any = null) {}

    static failure(message: string) {
        return new Result(false, message);
    }

    static success(message: string, data: any) {
        return new Result(true, message, data);
    }
}