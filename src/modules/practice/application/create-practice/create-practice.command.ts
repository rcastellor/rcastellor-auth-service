export class CreatePracticeCommand {
    constructor(public readonly uuid,
        public readonly questions: string[],
        public readonly responses: number[][],
        public readonly review: boolean[]) {
    }
}