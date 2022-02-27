import { Result } from 'src/shared/domain/result';
import { IUserRepository } from '../domain/user.repository';

export class Refresh {
    constructor(private readonly userRepository: IUserRepository) {
    }

    async execute(sub: string) {
        const user = await this.userRepository.findByUuid(sub);
        if(user) {
            return Result.success('User found', user);
        }
        return Result.failure(`User ${sub} not found`);
        //TODO: generate domain events on refresh (stats, etc)
    }
}