import { Result } from '../../../shared/domain/result';
import { IPasswordSecure } from '../domain/password-secure.interface';
import { AuthUser } from '../domain/auth-user.entity';
import { IUserRepository } from '../domain/user.repository';
import { AuthUserUuid } from '../domain/value-object/auth-user-uuid';
import { UserStatus } from '../domain/value-object/auth-user-status';

export class Signup {
    constructor(private readonly userRepository: IUserRepository,
        private readonly passwordSecure: IPasswordSecure) { }

    async execute(uuid: string, username: string, password: string, email: string) {
        const authUuid = new AuthUserUuid(uuid);
        let user = await this.userRepository.findByUuid(authUuid.value);
        if (user) {
            return Result.failure('User already exists');
        }
        user = await this.userRepository.findByUsername(username);
        if (user) {
            return Result.failure('User already exists');
        }
        user = AuthUser.fromPrimitives({
            uuid,
            username,
            password: await this.passwordSecure.secure(password),
            email,
            status: UserStatus.ACTIVE,
        });
        this.userRepository.save(user);
        return Result.success('User created', user);
    }
}