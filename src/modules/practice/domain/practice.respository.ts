import { Practice } from '.';

export interface IPracticeRepository {
    save(practice: Practice): void;
    findByUuid(uuid: string): Promise<Practice>;
    //findByCriteria(criteria: Criteria)
}