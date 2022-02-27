import { Result } from '../../../shared/domain/result';
import { IPasswordSecure } from '../../../shared/domain/password-secure.interface';
import { AuthUser } from '../domain/auth-user.entity';
import { IUserRepository } from '../domain/user.repository';
import { AuthUuid } from '../domain/value-object/auth-uuid';

export class Signup {
    constructor(private readonly userRepository: IUserRepository,
        private readonly passwordSecure: IPasswordSecure) {}

    async execute(uuid: string, username: string, password: string, email: string) {
        const authUuid = new AuthUuid(uuid);
        let user = await this.userRepository.findByUuid(authUuid.value);
        if(user) {
            return Result.failure('User already exists');
        }
        user = await this.userRepository.findByUsername(username);
        if(user) {
            return Result.failure('User already exists');
        }
        user = AuthUser.fromPrimitives({
            uuid,
            username,
            password: await this.passwordSecure.secure(password),
            email
        });
        await this.userRepository.save(user);
        return Result.success('User created', user);
    }
}