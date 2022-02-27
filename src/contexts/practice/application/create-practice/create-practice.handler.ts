import { IPracticeRepository } from "../../domain";
import { CreatePracticeCommand } from "./create-practice.command";

export class CreatePracticeHandler {
    constructor(private readonly practiceRepository: IPracticeRepository) {
    }
    execute(command: CreatePracticeCommand) {
        //const practiceId = new PracticeID(UUID.);
        //const Practice.create(practiceId)
    }
}