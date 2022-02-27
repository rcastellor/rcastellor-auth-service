import { IPasswordSecure } from '../../../shared/domain/password-secure.interface';
import { IUserRepository } from '../domain/user.repository';
import { Credentials } from '../domain/credentials.model';
import { Result } from '../../../shared/domain/result';


export class Signin {

    constructor(private readonly userRepository: IUserRepository,
        private readonly passwordSecure: IPasswordSecure) {}

    async execute(credentials: Credentials): Promise<Result> {
        const user = await this.userRepository.findByUsername(credentials.username);
        if(user && await this.passwordSecure.secure(credentials.password) === user.password.value) {
            return Result.success('User logged', user);
        }
        return Result.failure('Authentication error');
    }

}